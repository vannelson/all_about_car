import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Stack,
  HStack,
  VStack,
  Text,
  Input,
  Select,
  Image,
  Divider,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  StepTitle,
  StepDescription,
  Heading,
  useSteps,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import BaseModal from "../../base/BaseModal";
import ImageUpload from "../ImageUpload";
import {
  FaRoute,
  FaUser,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaDownload,
  FaMoneyBillWave,
  FaClock,
  FaTag,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import { createBookingApi } from "../../../services/bookings";
import { fetchCars } from "../../../store/carsSlice";

const toNumber = (str = "0") =>
  Number(String(str).replace(/,/g, "").trim()) || 0;
const hoursBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e) || e <= s) return 0;
  return Math.ceil((e - s) / (1000 * 60 * 60));
};
const daysBetween = (start, end) => {
  const hrs = hoursBetween(start, end);
  if (hrs === 0) return 0;
  return Math.ceil(hrs / 24);
};

const steps = [
  { title: "Trip", description: "Dates & Locations", icon: FaRoute },
  { title: "Renter", description: "Contact & ID", icon: FaUser },
  { title: "Review", description: "Summary & Confirm", icon: FaClipboardCheck },
];

export default function BookingModal({
  isOpen,
  onClose,
  car = {},
  startAt,
  endAt,
}) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const dispatch = useDispatch();
  const [pickupAt, setPickupAt] = useState("");
  const [returnAt, setReturnAt] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  // Borrower is nullable for this flow
  const [borrowerId] = useState("");
  const [renterFirstName, setRenterFirstName] = useState("");
  const [renterMiddleName, setRenterMiddleName] = useState("");
  const [renterLastName, setRenterLastName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [renterAddress, setRenterAddress] = useState("");
  const [idType, setIdType] = useState("DriverLicense");
  const [idLabel, setIdLabel] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idImages, setIdImages] = useState([]);
  const [extraPayment, setExtraPayment] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const auth = useSelector((s) => s.auth);
  const carsInStore = useSelector((s) => s.cars?.items || []);
  const carsLoading = useSelector((s) => s.cars?.listLoading || false);
  const toast = useToast();

  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const panelBg = useColorModeValue("gray.50", "gray.700");
  const sidebarBg = useColorModeValue("gray.50", "gray.800");

  // Small helper for table-like rows with icons
  const InfoRow = ({ icon, label, value, emphasize = false }) => (
    <HStack justify="space-between" py={2} px={2} borderBottom="1px solid" borderColor={useColorModeValue("gray.100", "gray.700")}> 
      <HStack spacing={2} color={useColorModeValue("gray.600", "gray.300")}> 
        {icon && <Icon as={icon} boxSize={4} />} 
        <Text fontSize="sm">{label}</Text>
      </HStack>
      <Text fontWeight={emphasize ? "bold" : "semibold"} color={emphasize ? "green.600" : useColorModeValue("gray.800", "gray.100")}>
        {value}
      </Text>
    </HStack>
  );

  // Resolve effective car VM from prop, localStorage (full raw), or Redux store by id
  const effectiveCar = useMemo(() => {
    if (car && (car.raw || car.rates)) return car;
    // Try full raw from localStorage (selectedCarInfo)
    try {
      const ls = localStorage.getItem("selectedCarInfo");
      if (ls) {
        const obj = JSON.parse(ls);
        if (obj && (obj.info_make || Array.isArray(obj?.rates))) {
          return { id: obj.id, raw: obj };
        }
      }
    } catch {}
    // Fallback by id via Redux store
    let id = car?.id;
    if (!id) {
      try {
        const raw = localStorage.getItem("selectedCarInfo");
        if (raw) id = JSON.parse(raw)?.id;
      } catch {}
    }
    if (id != null) {
      const vm = (carsInStore || []).find((x) => Number(x?.id) === Number(id));
      if (vm) return vm;
    }
    return null;
  }, [car, carsInStore]);

  // No car gallery dependency for ID images anymore

  // Extract only ACTIVE rates from raw
  const activeRates = useMemo(() => {
    const rawRates = effectiveCar?.raw?.rates;
    if (Array.isArray(rawRates)) {
      const actives = rawRates.filter((r) => String(r?.status || "").toLowerCase() === "active");
      const daily = Number(actives.find((r) => String(r?.rate_type||"").toLowerCase()==="daily")?.rate) || 0;
      const hourly = Number(actives.find((r) => String(r?.rate_type||"").toLowerCase()==="hourly")?.rate) || 0;
      return { daily, hourly };
    }
    // fallback to mapped VM rates (these already try to use active ones)
    const mapped = effectiveCar?.rates;
    return { daily: Number(mapped?.daily||0), hourly: Number(mapped?.hourly||0) };
  }, [effectiveCar]);

  const chosenRateType = useMemo(() => {
    if (activeRates.daily > 0) return "daily";
    if (activeRates.hourly > 0) return "hourly";
    const fromCard = String(car?.rateType || "").toLowerCase();
    if (fromCard.includes("hour")) return "hourly";
    return "daily";
  }, [activeRates, car?.rateType]);

  const baseRate = useMemo(() => {
    return toNumber(chosenRateType === "hourly" ? activeRates.hourly : activeRates.daily);
  }, [chosenRateType, activeRates]);

  const quantities = useMemo(() => {
    if (!pickupAt || !returnAt)
      return {
        qty: 0,
        label: chosenRateType === "hourly" ? "hour(s)" : "day(s)",
      };
    if (chosenRateType === "hourly") {
      const hrs = hoursBetween(pickupAt, returnAt);
      return { qty: hrs, label: "hour(s)" };
    }
    const d = daysBetween(pickupAt, returnAt);
    return { qty: d, label: "day(s)" };
  }, [pickupAt, returnAt, chosenRateType]);

  const total = useMemo(() => {
    const qty = quantities.qty;
    if (!qty || !baseRate) return 0;
    return qty * baseRate;
  }, [quantities.qty, baseRate]);

  const isTripValid = pickupAt && returnAt && quantities.qty > 0;
  const isRenterValid =
    renterFirstName.trim().length > 0 &&
    renterLastName.trim().length > 0 &&
    renterPhone.trim().length >= 7 &&
    idNumber.trim().length > 0;
  const canSubmit = isTripValid && isRenterValid;

  // Initialize dates from props when the modal opens via calendar selection
  useEffect(() => {
    if (isOpen) {
      if (startAt) setPickupAt(startAt);
      if (endAt) setReturnAt(endAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startAt, endAt]);

  // Ensure car list is loaded to resolve full car from Redux by id
  useEffect(() => {
    if (!isOpen) return;
    if ((carsInStore || []).length === 0 && !carsLoading) {
      dispatch(fetchCars({ page: 1, limit: 20, filters: {} }));
    }
  }, [isOpen, carsInStore, carsLoading, dispatch]);

  function formatDateTime(val) {
    if (!val) return null;
    try {
      const d = new Date(val);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;
    } catch {
      return String(val);
    }
  }

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      // Resolve car_id from prop or localStorage fallback
      let carId = car?.id ?? null;
      if (!carId) {
        try {
          const raw = localStorage.getItem("selectedCarInfo");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id != null) carId = Number(parsed.id) || null;
          }
        } catch {}
      }
      if (!carId) {
        toast({ title: "Select a car", description: "Please pick a car from the list before booking.", status: "error" });
        setSubmitting(false);
        return;
      }
      const qty = quantities.qty || 0;
      const base_amount = qty * baseRate;
      const extra_payment = Number(extraPayment) || 0;
      const discount = 0;
      const total_amount = base_amount + extra_payment - discount;
      // identification_images: reuse ImageUpload (base64 or data URLs)
      const identification_images = Array.isArray(idImages) ? idImages : [];

      const bookingBody = {
        car_id: carId,
        borrower_id: borrowerId ? Number(borrowerId) || null : null, // optional when authenticated
        tenant_id: auth?.user?.id ?? null,
        start_date: formatDateTime(pickupAt),
        end_date: formatDateTime(returnAt),
        expected_return_date: formatDateTime(returnAt),
        actual_return_date: null,
        destination: dropoffLocation || pickupLocation || "",
        rate: Number(baseRate) || 0,
        rate_type: chosenRateType,
        base_amount,
        extra_payment,
        discount,
        total_amount,
        payment_status: "Pending",
        status: "Reserved",
        identification_type: idType,
        identification: idLabel,
        identification_number: idNumber,
        renter_first_name: renterFirstName,
        renter_middle_name: renterMiddleName,
        renter_last_name: renterLastName,
        renter_address: renterAddress,
        renter_phone_number: renterPhone,
        renter_email: renterEmail || undefined,
        identification_images,
      };

      const res = await createBookingApi(bookingBody);
      toast({
        title: "Booking created",
        description: res?.message || "Success",
        status: "success",
      });
      onClose?.();
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Request failed";
      toast({ title: "Action failed", description: msg, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      const w = window.open("", "_blank", "width=800,height=900");
      if (!w) return;
      const title = `Booking_${car?.name || "Vehicle"}`;
      const styles = `
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          h1 { font-size: 18px; margin-bottom: 8px; }
          h2 { font-size: 14px; margin: 16px 0 8px; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          .label { color: #555; font-size: 12px; }
          .val { font-weight: 600; font-size: 12px; }
          hr { border: 0; border-top: 1px solid #eee; margin: 12px 0; }
        </style>
      `;
      const html = `
        <html>
          <head>
            <title>${title}</title>
            ${styles}
          </head>
          <body>
            <h1>Booking Summary - ${car?.name || "Vehicle"}</h1>
            <h2>Trip</h2>
            <div class="row"><div class="label">Pickup</div><div class="val">${
              pickupAt ? new Date(pickupAt).toLocaleString() : "-"
            }</div></div>
            <div class="row"><div class="label">Return</div><div class="val">${
              returnAt ? new Date(returnAt).toLocaleString() : "-"
            }</div></div>
            <div class="row"><div class="label">Pickup Location</div><div class="val">${
              pickupLocation || "-"
            }</div></div>
            <div class="row"><div class="label">Drop-off Location</div><div class="val">${
              dropoffLocation || "-"
            }</div></div>
            <hr />
            <h2>Renter</h2>
            <div class="row"><div class="label">Name</div><div class="val">${
              [renterFirstName, renterMiddleName, renterLastName]
                .filter(Boolean)
                .join(" ") || "-"
            }</div></div>
            <div class="row"><div class="label">Phone</div><div class="val">${
              renterPhone || "-"
            }</div></div>
            <div class="row"><div class="label">Email</div><div class="val">${
              renterEmail || "-"
            }</div></div>
            <div class="row"><div class="label">Address</div><div class="val">${
              renterAddress || "-"
            }</div></div>
            <div class="row"><div class="label">ID Type</div><div class="val">${
              idType || "-"
            }</div></div>
            <div class="row"><div class="label">ID Number</div><div class="val">${
              idNumber || "-"
            }</div></div>
            <div class="row"><div class="label">ID Label</div><div class="val">${
              idLabel || "-"
            }</div></div>
            <hr />
            <h2>Pricing</h2>
            <div class="row"><div class="label">Rate</div><div class="val">${baseRate.toLocaleString()} / ${chosenRateType}</div></div>
            <div class="row"><div class="label">Quantity</div><div class="val">${
              quantities.qty
            } ${quantities.label}</div></div>
            <div class="row"><div class="label">Base Amount</div><div class="val">${(
              quantities.qty * baseRate
            ).toLocaleString()}</div></div>
            <div class="row"><div class="label">Extra Payment</div><div class="val">${(
              Number(extraPayment) || 0
            ).toLocaleString()}</div></div>
            <div class="row"><div class="label">Total</div><div class="val">${(
              total + (Number(extraPayment) || 0)
            ).toLocaleString()}</div></div>
            <script>window.onload = function(){ window.print(); }</script>
          </body>
        </html>
      `;
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("PDF download failed", e);
    }
  };

  return (
    <BaseModal
      title={`Book ${car?.name || "Vehicle"}`}
      size="6xl"
      isOpen={isOpen}
      onClose={onClose}
      hassFooter={false}
    >
      <Box p={0} bg="white">
        <Grid
          templateColumns={{ base: "1fr", md: "2fr 1fr" }}
          gap={0}
          minH="500px"
        >
          <GridItem>
            <Box p={{ base: 5, md: 6 }}>
              <Stepper index={activeStep} colorScheme="blue" size="sm" mb={6}>
                {steps.map((s, i) => (
                  <Step key={i}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <Box flexShrink={0} ml={2}>
                      <StepTitle fontSize="sm" fontWeight="semibold">
                        {s.title}
                      </StepTitle>
                      <StepDescription fontSize="xs">
                        {s.description}
                      </StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              <Box p={{ base: 4, md: 5 }}>
                {activeStep === 0 && (
                  <Stack spacing={4}>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FaRoute} color={primaryColor} boxSize={5} />
                      <Heading size="md" color="gray.700">
                        Trip Details
                      </Heading>
                    </HStack>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={5}
                    >
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Pickup Date & Time
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          value={pickupAt}
                          onChange={(e) => setPickupAt(e.target.value)}
                          size="md"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Return Date & Time
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          value={returnAt}
                          onChange={(e) => setReturnAt(e.target.value)}
                          size="md"
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={5}
                    >
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                            <Text>Pickup Location</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          placeholder="Enter pickup location"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          size="md"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="gray.500" />
                            <Text>Drop-off Location</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          placeholder="Enter drop-off location"
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          size="md"
                        />
                      </FormControl>
                    </Grid>
                    {quantities.qty > 0 && (
                      <Alert
                        status="success"
                        variant="subtle"
                        borderRadius="md"
                      >
                        <AlertIcon />
                        <Text fontSize="sm">
                          Duration:{" "}
                          <Badge colorScheme="green">
                            {quantities.qty} {quantities.label}
                          </Badge>
                        </Text>
                      </Alert>
                    )}
                  </Stack>
                )}

                {activeStep === 1 && (
                  <Stack spacing={4}>
                    <HStack spacing={3} mb={2}>
                      <Icon as={FaUser} color={primaryColor} boxSize={5} />
                      <Heading size="md" color="gray.700">
                        Renter Information
                      </Heading>
                    </HStack>

                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                      gap={3}
                    >
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Last Name
                        </FormLabel>
                        <Input
                          value={renterLastName}
                          onChange={(e) => setRenterLastName(e.target.value)}
                          placeholder="Delacruz"
                          size="md"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          First Name
                        </FormLabel>
                        <Input
                          value={renterFirstName}
                          onChange={(e) => setRenterFirstName(e.target.value)}
                          placeholder="Miguel"
                          size="md"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Middle Name
                        </FormLabel>
                        <Input
                          value={renterMiddleName}
                          onChange={(e) => setRenterMiddleName(e.target.value)}
                          placeholder="Santos"
                          size="md"
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={3}
                    >
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Phone Number
                        </FormLabel>
                        <Input
                          placeholder="+63 912 345 6789"
                          value={renterPhone}
                          onChange={(e) => setRenterPhone(e.target.value)}
                          size="md"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Email
                        </FormLabel>
                        <Input
                          type="email"
                          value={renterEmail}
                          onChange={(e) => setRenterEmail(e.target.value)}
                          placeholder="miguel.delacruz@example.com"
                          size="md"
                        />
                      </FormControl>
                    </Grid>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">
                        Address
                      </FormLabel>
                      <Input
                        placeholder="Blk 4 Lot 7, Greenfield Subd., Cebu City"
                        value={renterAddress}
                        onChange={(e) => setRenterAddress(e.target.value)}
                        size="md"
                      />
                    </FormControl>

                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={3}
                    >
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          ID Type
                        </FormLabel>
                        <Select
                          value={idType}
                          onChange={(e) => setIdType(e.target.value)}
                          size="md"
                        >
                          <option value="DriverLicense">Driver License</option>
                          <option value="Passport">Passport</option>
                          <option value="NationalID">National ID</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          ID Number
                        </FormLabel>
                        <Input
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          placeholder="DL-99887766"
                          size="md"
                        />
                      </FormControl>
                    </Grid>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">
                        Identification Label
                      </FormLabel>
                      <Input
                        value={idLabel}
                        onChange={(e) => setIdLabel(e.target.value)}
                        placeholder="PH Driver License"
                        size="md"
                      />
                    </FormControl>

                    <Box>
                      <FormLabel fontSize="sm" fontWeight="medium">Identification Images</FormLabel>
                      <ImageUpload
                        multiple={true}
                        maxFiles={10}
                        onImagesChange={(imgs) => setIdImages(imgs || [])}
                        initialImages={idImages}
                      />
                    </Box>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">
                        Extra Payment (optional)
                      </FormLabel>
                      <Input
                        type="number"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(e.target.value)}
                        placeholder="0"
                        size="md"
                      />
                      <FormHelperText>
                        Enter any additional charge to include
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                )}

                {activeStep === 2 && (
                  <Stack spacing={4}>
                    <HStack spacing={3} mb={2}>
                      <Icon
                        as={FaClipboardCheck}
                        color={primaryColor}
                        boxSize={5}
                      />
                      <Heading size="md" color="gray.700">
                        Booking Summary
                      </Heading>
                    </HStack>

                    <Alert status="info" variant="subtle" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        Please review your booking details before confirming
                      </Text>
                    </Alert>

                    <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
                      <CardHeader pb={2}><Heading size="sm">Trip Details</Heading></CardHeader>
                      <CardBody pt={0}>
                        <VStack spacing={0} align="stretch">
                          <InfoRow icon={FaRoute} label="Pickup" value={pickupAt ? new Date(pickupAt).toLocaleString() : "-"} />
                          <InfoRow icon={FaRoute} label="Return" value={returnAt ? new Date(returnAt).toLocaleString() : "-"} />
                          <InfoRow icon={FaMapMarkerAlt} label="Pickup Location" value={pickupLocation || "-"} />
                          <InfoRow icon={FaMapMarkerAlt} label="Drop-off Location" value={dropoffLocation || "-"} />
                        </VStack>
                      </CardBody>
                    </Card>

                    <Divider />

                    {/* Renter and pricing details are shown on the right sidebar */}
                  </Stack>
                )}

                <Flex justify="space-between" mt={6}>
                  <Button
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    isDisabled={activeStep === 0}
                    variant="outline"
                    size="md"
                  >
                    Previous
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        if (activeStep === 0 && !isTripValid) return;
                        if (activeStep === 1 && !isRenterValid) return;
                        setActiveStep((s) => Math.min(steps.length - 1, s + 1));
                      }}
                      size="md"
                      isDisabled={
                        (activeStep === 0 && !isTripValid) ||
                        (activeStep === 1 && !isRenterValid)
                      }
                    >
                      Continue
                    </Button>
                  ) : (
                    <HStack>
                      <Button
                        leftIcon={<FaDownload />}
                        variant="outline"
                        onClick={handleDownloadPdf}
                        size="md"
                      >
                        Download PDF
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={handleConfirm}
                        isLoading={submitting}
                        isDisabled={!canSubmit || submitting}
                        size="md"
                      >
                        Confirm Booking
                      </Button>
                    </HStack>
                  )}
                </Flex>
              </Box>
            </Box>
          </GridItem>
          <GridItem bg={sidebarBg} display={{ base: "none", md: "block" }}>
            <Box p={6} position="sticky" top={0}>
              <Stack spacing={4}>
                <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
                  <CardHeader pb={2}><Heading size="sm">Payment Details</Heading></CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={0} align="stretch">
                      <InfoRow icon={FaMoneyBillWave} label="Rate" value={`${baseRate.toLocaleString()} / ${chosenRateType}`} />
                      <InfoRow icon={FaClock} label="Quantity" value={`${quantities.qty} ${quantities.label}`} />
                      <InfoRow icon={FaTag} label="Base Amount" value={(quantities.qty * baseRate).toLocaleString()} />
                      <InfoRow icon={FaTag} label="Extra Payment" value={(Number(extraPayment)||0).toLocaleString()} />
                      <HStack justify="space-between" pt={3}>
                        <HStack spacing={2}><Icon as={FaMoneyBillWave} color="green.600" boxSize={4} /><Text fontWeight="bold">Total</Text></HStack>
                        <Text fontWeight="bold" color="green.600">{(total + (Number(extraPayment)||0)).toLocaleString()}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
                  <CardHeader pb={2}><Heading size="sm">Renter Information</Heading></CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={0} align="stretch">
                      <InfoRow icon={FaUser} label="Name" value={[renterFirstName, renterMiddleName, renterLastName].filter(Boolean).join(" ") || "-"} />
                      <InfoRow icon={FaPhone} label="Phone" value={renterPhone || "-"} />
                      <InfoRow icon={FaEnvelope} label="Email" value={renterEmail || "-"} />
                      <InfoRow icon={FaHome} label="Address" value={renterAddress || "-"} />
                      <InfoRow icon={FaIdCard} label="ID Type" value={idType || "-"} />
                      <InfoRow icon={FaIdCard} label="ID Number" value={idNumber || "-"} />
                    </VStack>
                  </CardBody>
                </Card>
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </BaseModal>
  );
}
