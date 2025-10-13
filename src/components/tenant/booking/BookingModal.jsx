import { useCallback, useEffect, useMemo, useState } from "react";
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
import { createBookingApi, updateBookingApi } from "../../../services/bookings";
import { fetchCars } from "../../../store/carsSlice";
import {
  computeActiveRates,
  chooseRateType,
  computeBaseRate,
  computeQuantities,
  computeBaseAmount,
  computeTotal,
  formatDateTimeLocalToApi,
  formatDateTimeToInput,
} from "../../../utils/booking";

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
  booking,
  mode = "create",
  onBookingCreated,
  onBookingUpdated,
}) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const isEditMode = mode === "edit" && Boolean(booking?.id);
  const dispatch = useDispatch();
  const [pickupAt, setPickupAt] = useState("");
  const [returnAt, setReturnAt] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  // Borrower is nullable for this flow
  const [borrowerId, setBorrowerId] = useState("");
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
  const [extraPayment, setExtraPayment] = useState("0");
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

  const resolvedCar = useMemo(() => {
    if (isEditMode && booking && booking.car) return booking.car;
    return car;
  }, [isEditMode, booking, car]);

  // Resolve effective car VM from prop, localStorage (full raw), or Redux store by id
  const effectiveCar = useMemo(() => {
    if (resolvedCar && (resolvedCar.raw || resolvedCar.rates)) return resolvedCar;
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
  }, [resolvedCar, carsInStore]);

  // No car gallery dependency for ID images anymore

  // Extract only ACTIVE rates from raw
  const activeRates = useMemo(() => computeActiveRates(effectiveCar), [effectiveCar]);
  const chosenRateType = useMemo(
    () => chooseRateType(activeRates, resolvedCar?.rateType),
    [activeRates, resolvedCar?.rateType]
  );
  const effectiveRateType = useMemo(() => {
    if (isEditMode) {
      const rt = String(booking?.rate_type || "").toLowerCase();
      if (rt.includes("hour")) return "hourly";
      if (rt.includes("day")) return "daily";
    }
    return chosenRateType;
  }, [isEditMode, booking?.rate_type, chosenRateType]);
  const baseRate = useMemo(() => {
    if (isEditMode && booking?.rate != null) return Number(booking.rate) || 0;
    return computeBaseRate(activeRates, effectiveRateType);
  }, [isEditMode, booking?.rate, activeRates, effectiveRateType]);

  // Derived pricing and validation
  const quantities = useMemo(
    () => computeQuantities(effectiveRateType, pickupAt, returnAt),
    [effectiveRateType, pickupAt, returnAt]
  );
  const baseAmount = useMemo(() => computeBaseAmount(baseRate, quantities.qty), [baseRate, quantities]);
  const discountValue = useMemo(
    () => (isEditMode ? Number(booking?.discount || 0) : 0),
    [isEditMode, booking?.discount]
  );
  const total = useMemo(
    () => computeTotal(baseAmount, Number(extraPayment) || 0, discountValue),
    [baseAmount, extraPayment, discountValue]
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
  const submitLabel = isEditMode ? "Save Changes" : "Confirm Booking";

  useEffect(() => {
    if (!isOpen) return;
    setActiveStep(0);
    if (isEditMode) {
      const src = booking || {};
      setPickupAt(formatDateTimeToInput(src.start_date) || "");
      setReturnAt(formatDateTimeToInput(src.end_date) || "");
      setPickupLocation(src.pickup_location || "");
      setDropoffLocation(src.dropoff_location || src.destination || "");
      setBorrowerId(
        src.borrower_id != null && src.borrower_id !== ""
          ? String(src.borrower_id)
          : ""
      );
      setRenterFirstName(src.renter_first_name || "");
      setRenterMiddleName(src.renter_middle_name || "");
      setRenterLastName(src.renter_last_name || "");
      setRenterPhone(src.renter_phone_number || src.renter_phone || "");
      setRenterEmail(src.renter_email || "");
      setRenterAddress(src.renter_address || "");
      setIdType(src.identification_type || "DriverLicense");
      setIdLabel(src.identification || "");
      setIdNumber(src.identification_number || "");
      setIdImages(
        Array.isArray(src.identification_images)
          ? [...src.identification_images]
          : []
      );
      setExtraPayment(
        src.extra_payment != null && src.extra_payment !== ""
          ? String(src.extra_payment)
          : "0"
      );
    } else {
      setPickupAt(startAt || "");
      setReturnAt(endAt || "");
      setPickupLocation("");
      setDropoffLocation("");
      setBorrowerId("");
      setRenterFirstName("");
      setRenterMiddleName("");
      setRenterLastName("");
      setRenterPhone("");
      setRenterEmail("");
      setRenterAddress("");
      setIdType("DriverLicense");
      setIdLabel("");
      setIdNumber("");
      setIdImages([]);
      setExtraPayment("0");
    }
  }, [
    isOpen,
    isEditMode,
    booking,
    startAt,
    endAt,
    setActiveStep,
  ]);

  // Submit booking
  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    const tenantId = booking?.tenant_id ?? auth?.user?.id ?? null;
    const carId =
      booking?.car_id ||
      effectiveCar?.id ||
      resolvedCar?.id ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("selectedCarInfo") || "{}").id;
        } catch {
          return null;
        }
      })();

    if (!carId) {
      toast({
        title: "Unable to determine car for booking",
        status: "error",
      });
      return;
    }

    const borrowerValue =
      booking?.borrower_id ??
      (borrowerId !== "" ? Number(borrowerId) || borrowerId : null);
    const baseRateValue = Number(baseRate) || 0;
    const baseAmountValue = Number(baseAmount) || 0;
    const extraPaymentValue = Number(extraPayment) || 0;
    const quantityValue = Number(quantities.qty) || 0;
    const discount = Number(discountValue) || 0;
    const totalValue = computeTotal(baseAmountValue, extraPaymentValue, discount);
    const destinationValue = dropoffLocation || booking?.destination || "";

    const payload = {
      tenant_id: tenantId,
      car_id: carId,
      borrower_id: borrowerValue,
      start_date: formatDateTimeLocalToApi(pickupAt),
      end_date: formatDateTimeLocalToApi(returnAt),
      expected_return_date: formatDateTimeLocalToApi(returnAt),
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      destination: destinationValue,
      rate_type: effectiveRateType,
      rate: baseRateValue,
      quantity: quantityValue,
      base_amount: baseAmountValue,
      extra_payment: extraPaymentValue,
      discount,
      total_amount: Number(totalValue) || 0,
      payment_status: isEditMode
        ? booking?.payment_status || "Paid"
        : "Pending",
      status: isEditMode ? booking?.status || "Reserved" : "Ongoing",
      identification_type: idType,
      identification: idLabel,
      identification_number: idNumber,
      identification_images: idImages,
      renter_first_name: renterFirstName,
      renter_middle_name: renterMiddleName,
      renter_last_name: renterLastName,
      renter_address: renterAddress,
      renter_phone_number: renterPhone,
      renter_email: renterEmail,
    };

    if (isEditMode) {
      payload.actual_return_date = booking?.actual_return_date ?? null;
      if (booking?.tenant_id) {
        payload.tenant_id = booking.tenant_id;
      }
      if (
        booking?.borrower_id &&
        (payload.borrower_id === null || payload.borrower_id === "")
      ) {
        payload.borrower_id = booking.borrower_id;
      }
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    try {
      setSubmitting(true);
      if (isEditMode) {
        const response = await updateBookingApi({ id: booking.id, ...payload });
        const updated = response?.data || response || {};
        const merged = { ...booking, ...payload, ...updated, id: booking.id };
        if (typeof onBookingUpdated === "function") {
          onBookingUpdated(merged);
        }
        try {
          window.dispatchEvent(
            new CustomEvent("tc:bookingUpdated", { detail: merged })
          );
        } catch {}
        toast({ title: "Booking updated", status: "success" });
      } else {
        const response = await createBookingApi(payload);
        const created = response?.data || response || {};
        const bookingForEvent = {
          ...payload,
          ...created,
          status: created?.status || payload.status,
          start_date: created?.start_date || payload.start_date,
          end_date: created?.end_date || payload.end_date,
          expected_return_date:
            created?.expected_return_date || payload.expected_return_date,
          renter_first_name:
            created?.renter_first_name ?? payload.renter_first_name,
          renter_middle_name:
            created?.renter_middle_name ?? payload.renter_middle_name,
          renter_last_name:
            created?.renter_last_name ?? payload.renter_last_name,
          renter_phone_number:
            created?.renter_phone_number ?? payload.renter_phone_number,
          renter_email: created?.renter_email ?? payload.renter_email,
          renter_address: created?.renter_address ?? payload.renter_address,
          car_id: created?.car_id ?? payload.car_id,
        };
        if (!bookingForEvent.car && effectiveCar) {
          bookingForEvent.car = effectiveCar.raw || effectiveCar;
        }
        if (!bookingForEvent.id && created?.id) {
          bookingForEvent.id = created.id;
        }
        try {
          window.dispatchEvent(
            new CustomEvent("tc:bookingCreated", { detail: bookingForEvent })
          );
        } catch {}
        if (typeof onBookingCreated === "function") {
          onBookingCreated(bookingForEvent);
        }
        toast({ title: "Booking created", status: "success" });
        try {
          localStorage.removeItem("selectedCarInfo");
        } catch {}
      }
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (isEditMode ? "Failed to update booking" : "Failed to create booking");
      toast({ title: msg, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={
        isEditMode
          ? `Edit Booking${booking?.id ? ` #${booking.id}` : ""}`
          : `Book ${resolvedCar?.name || "Vehicle"}`
      }
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
                  key={isEditMode ? `trip-${booking?.id ?? "edit"}` : "trip-create"}
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
                  key={isEditMode ? `renter-${booking?.id ?? "edit"}` : "renter-create"}
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
                        onClick={handleSubmit}
                        isLoading={submitting}
                        isDisabled={!canSubmit || submitting}
                        size="md"
                      >
                        {submitLabel}
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
                  chosenRateType={effectiveRateType}
                  quantities={quantities}
                  extraPayment={extraPayment}
                  discount={discountValue}
                  total={total}
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

