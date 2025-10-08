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
import BookingTripForm from "../form/BookingTripForm";
import BookingRenterForm from "../form/BookingRenterForm";
import PaymentDetailsCard from "../form/PaymentDetailsCard";
import RenterInfoCard from "../form/RenterInfoCard";
import InfoRow from "../form/InfoRow";
import {
  FaRoute,
  FaUser,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaDownload,
} from "react-icons/fa";
import { createBookingApi } from "../../../services/bookings";
import { fetchCars } from "../../../store/carsSlice";
import {
  computeActiveRates,
  chooseRateType,
  computeBaseRate,
  computeQuantities,
  computeBaseAmount,
  computeTotal,
  formatDateTimeLocalToApi,
} from "../../../utils/booking";

const toNumber = (str = "0") =>
  Number(String(str).replace(/,/g, "").trim()) || 0;

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
  onBookingCreated,
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
  const activeRates = useMemo(
    () => computeActiveRates(effectiveCar),
    [effectiveCar]
  );
  const chosenRateType = useMemo(
    () => chooseRateType(activeRates, car?.rateType),
    [activeRates, car?.rateType]
  );
  const baseRate = useMemo(
    () => computeBaseRate(activeRates, chosenRateType),
    [activeRates, chosenRateType]
  );

  // Derived pricing and validation
  const quantities = useMemo(
    () => computeQuantities(chosenRateType, pickupAt, returnAt),
    [chosenRateType, pickupAt, returnAt]
  );
  const baseAmount = useMemo(
    () => computeBaseAmount(baseRate, quantities.qty),
    [baseRate, quantities]
  );
  const total = useMemo(
    () => computeTotal(baseAmount, Number(extraPayment) || 0, 0),
    [baseAmount, extraPayment]
  );

  const isTripValid = useMemo(() => {
    if (!pickupAt || !returnAt) return false;
    const s = new Date(pickupAt);
    const e = new Date(returnAt);
    return !isNaN(s) && !isNaN(e) && e > s;
  }, [pickupAt, returnAt]);

  const isRenterValid = useMemo(() => {
    return (
      String(renterLastName).trim().length > 0 &&
      String(renterFirstName).trim().length > 0 &&
      String(renterPhone).trim().length > 0 &&
      String(idType).trim().length > 0 &&
      String(idNumber).trim().length > 0
    );
  }, [renterLastName, renterFirstName, renterPhone, idType, idNumber]);

  const canSubmit = isTripValid && isRenterValid && Number(baseRate) > 0;

  // Prefill dates from props if provided
  useEffect(() => {
    if (startAt) setPickupAt(startAt);
    if (endAt) setReturnAt(endAt);
  }, [startAt, endAt]);

  // Submit booking
  const handleConfirm = async () => {
    if (!canSubmit || submitting) return;
    try {
      setSubmitting(true);
      // Map to backend-required fields
      const tenantId = auth?.user?.id || null;
      const carId =
        effectiveCar?.id ||
        car?.id ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem("selectedCarInfo") || "{}")
              .id;
          } catch {
            return null;
          }
        })();

      const body = {
        // required identifiers
        tenant_id: tenantId,
        car_id: carId,

        // renter details (send as additional info if backend accepts extra fields)
        renter_first_name: renterFirstName,
        renter_middle_name: renterMiddleName,
        renter_last_name: renterLastName,
        renter_phone_number: renterPhone,
        renter_email: renterEmail,
        renter_address: renterAddress,

        // identification (rename per validation messages)
        identification_type: idType,
        identification: idLabel,
        identification_number: idNumber,
        identification_images: idImages,

        // trip dates (rename per backend)
        start_date: formatDateTimeLocalToApi(pickupAt),
        end_date: formatDateTimeLocalToApi(returnAt),
        expected_return_date: formatDateTimeLocalToApi(returnAt),

        // locations
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,

        // pricing
        rate_type: chosenRateType,
        rate: Number(baseRate) || 0,
        quantity: Number(quantities.qty) || 0,
        base_amount: Number(baseAmount) || 0,
        extra_payment: Number(extraPayment) || 0,
        discount: 0,
        total_amount: Number(total) || 0,

        // required statuses (per backend enum)
        payment_status: "Paid",
        status: "Ongoing",
      };

      const response = await createBookingApi(body);
      const created = response?.data || response || {};
      const bookingForEvent = {
        ...body,
        ...created,
        status: created?.status || "Ongoing",
        start_date: created?.start_date || body.start_date,
        end_date: created?.end_date || body.end_date,
        expected_return_date: created?.expected_return_date || body.expected_return_date,
        renter_first_name: created?.renter_first_name ?? body.renter_first_name,
        renter_middle_name: created?.renter_middle_name ?? body.renter_middle_name,
        renter_last_name: created?.renter_last_name ?? body.renter_last_name,
        renter_phone_number: created?.renter_phone_number ?? body.renter_phone_number,
        renter_email: created?.renter_email ?? body.renter_email,
        renter_address: created?.renter_address ?? body.renter_address,
        car_id: created?.car_id ?? carId,
      };
      if (!bookingForEvent.car && effectiveCar) {
        bookingForEvent.car = effectiveCar.raw || effectiveCar;
      }
      if (!bookingForEvent.id && created?.id) {
        bookingForEvent.id = created.id;
      }
      try {
        window.dispatchEvent(new CustomEvent("tc:bookingCreated", { detail: bookingForEvent }));
      } catch {}
      if (typeof onBookingCreated === "function") {
        onBookingCreated(bookingForEvent);
      }
      toast({ title: "Booking created", status: "success" });
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create booking";
      toast({ title: msg, status: "error" });
    } finally {
      setSubmitting(false);
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
                      <StepTitle fontWeight="semibold">{s.title}</StepTitle>
                      <StepDescription>{s.description}</StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>

              <Box p={{ base: 4, md: 5 }}>
                {activeStep === 0 && (
                  <Stack spacing={4}>
                <BookingTripForm
                  pickupAt={pickupAt}
                  setPickupAt={setPickupAt}
                  returnAt={returnAt}
                  setReturnAt={setReturnAt}
                  pickupLocation={pickupLocation}
                  setPickupLocation={setPickupLocation}
                  dropoffLocation={dropoffLocation}
                  setDropoffLocation={setDropoffLocation}
                  primaryColor={primaryColor}
                />
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
                <BookingRenterForm
                  primaryColor={primaryColor}
                  renterLastName={renterLastName}
                  setRenterLastName={setRenterLastName}
                  renterFirstName={renterFirstName}
                  setRenterFirstName={setRenterFirstName}
                  renterMiddleName={renterMiddleName}
                  setRenterMiddleName={setRenterMiddleName}
                  renterPhone={renterPhone}
                  setRenterPhone={setRenterPhone}
                  renterEmail={renterEmail}
                  setRenterEmail={setRenterEmail}
                  renterAddress={renterAddress}
                  setRenterAddress={setRenterAddress}
                  idType={idType}
                  setIdType={setIdType}
                  idNumber={idNumber}
                  setIdNumber={setIdNumber}
                  idLabel={idLabel}
                  setIdLabel={setIdLabel}
                  idImages={idImages}
                  setIdImages={setIdImages}
                  extraPayment={extraPayment}
                  setExtraPayment={setExtraPayment}
                />
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

                    <Card
                      variant="unstyled"
                      bg={panelBg}
                      border="0"
                      shadow="sm"
                      borderRadius="md"
                    >
                      <CardHeader pb={2}>
                        <Heading size="sm">Trip Details</Heading>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack spacing={0} align="stretch">
                          <InfoRow
                            icon={FaRoute}
                            label="Pickup"
                            value={
                              pickupAt
                                ? new Date(pickupAt).toLocaleString()
                                : "-"
                            }
                          />
                          <InfoRow
                            icon={FaRoute}
                            label="Return"
                            value={
                              returnAt
                                ? new Date(returnAt).toLocaleString()
                                : "-"
                            }
                          />
                          <InfoRow
                            icon={FaMapMarkerAlt}
                            label="Pickup Location"
                            value={pickupLocation || "-"}
                          />
                          <InfoRow
                            icon={FaMapMarkerAlt}
                            label="Drop-off Location"
                            value={dropoffLocation || "-"}
                          />
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
                <PaymentDetailsCard
                  panelBg={panelBg}
                  baseRate={baseRate}
                  chosenRateType={chosenRateType}
                  quantities={quantities}
                  extraPayment={extraPayment}
                  total={computeTotal(
                    computeBaseAmount(baseRate, quantities.qty),
                    Number(extraPayment) || 0,
                    0
                  )}
                />
                <RenterInfoCard
                  panelBg={panelBg}
                  renterFirstName={renterFirstName}
                  renterMiddleName={renterMiddleName}
                  renterLastName={renterLastName}
                  renterPhone={renterPhone}
                  renterEmail={renterEmail}
                  renterAddress={renterAddress}
                  idType={idType}
                  idNumber={idNumber}
                />
              </Stack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </BaseModal>
  );
}
