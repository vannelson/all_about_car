import { useMemo, useState } from "react";
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
  Textarea,
  Switch,
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
} from "@chakra-ui/react";
import {
  FaRoute,
  FaUser,
  FaPlusCircle,
  FaClipboardCheck,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import BaseModal from "../../base/BaseModal";

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
  { title: "Extras", description: "Add-ons", icon: FaPlusCircle },
  { title: "Review", description: "Summary & Confirm", icon: FaClipboardCheck },
];

const BookingModal = ({ isOpen, onClose, car = {} }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [pickupAt, setPickupAt] = useState("");
  const [returnAt, setReturnAt] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [idType, setIdType] = useState("Driver License");
  const [idNumber, setIdNumber] = useState("");
  const [needGPS, setNeedGPS] = useState(false);
  const [needSeat, setNeedSeat] = useState(false);
  const [notes, setNotes] = useState("");

  const chosenRateType = useMemo(() => {
    const fromCard = String(car?.rateType || "").toLowerCase();
    if (fromCard.includes("hour")) return "hourly";
    if (fromCard.includes("day")) return "daily";
    if (car?.rates?.daily) return "daily";
    if (car?.rates?.hourly) return "hourly";
    return "daily";
  }, [car?.rateType, car?.rates]);

  const baseRate = toNumber(
    chosenRateType === "hourly"
      ? car?.rates?.hourly
      : car?.rates?.daily || car?.rateAmount
  );

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

  const extrasCharge = (needGPS ? 200 : 0) + (needSeat ? 150 : 0);

  const total = useMemo(() => {
    const qty = quantities.qty;
    if (!qty || !baseRate) return 0;
    return qty * baseRate + extrasCharge;
  }, [quantities.qty, baseRate, extrasCharge]);

  const isTripValid = pickupAt && returnAt && quantities.qty > 0;
  const isRenterValid =
    renterName.trim().length > 1 &&
    renterPhone.trim().length >= 7 &&
    idNumber.trim().length > 0;
  const canSubmit = isTripValid && isRenterValid;

  // Color scheme
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.700");
  const sidebarBg = useColorModeValue("gray.50", "gray.800");

  const handleConfirm = () => {
    console.log("Booking created", {
      car: car?.name,
      pickupAt,
      returnAt,
      pickupLocation,
      dropoffLocation,
      renterName,
      renterPhone,
      idType,
      idNumber,
      extras: { gps: needGPS, babySeat: needSeat },
      notes,
      quantities,
      total,
    });
    onClose?.();
  };

  return (
    <BaseModal
      title={`Book ${car?.name || "Vehicle"}`}
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      hassFooter={false}
    >
      <Box p={0} bg="white">
        <Grid templateColumns={{ base: "1fr" }} gap={0} minH="500px">
          {/* Main Content */}
          <GridItem>
            <Box p={{ base: 5, md: 6 }}>
              <Stepper index={activeStep} colorScheme="blue" size="md" mb={6}>
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

              {/* Step Content */}
              <Card variant="outline" borderColor={borderColor}>
                <CardBody p={{ base: 4, md: 5 }}>
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

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Full Name
                        </FormLabel>
                        <Input
                          placeholder="Enter your full name"
                          value={renterName}
                          onChange={(e) => setRenterName(e.target.value)}
                          size="md"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Phone Number
                        </FormLabel>
                        <Input
                          placeholder="Enter your phone number"
                          value={renterPhone}
                          onChange={(e) => setRenterPhone(e.target.value)}
                          size="md"
                        />
                        <FormHelperText>
                          We'll use this to contact you about your booking
                        </FormHelperText>
                      </FormControl>

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 2fr" }}
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
                            <option>Driver License</option>
                            <option>Passport</option>
                            <option>National ID</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="medium">
                            ID Number
                          </FormLabel>
                          <Input
                            placeholder="Enter your ID number"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            size="md"
                          />
                        </FormControl>
                      </Grid>
                    </Stack>
                  )}

                  {activeStep === 2 && (
                    <Stack spacing={6}>
                      <HStack spacing={3} mb={2}>
                        <Icon
                          as={FaPlusCircle}
                          color={primaryColor}
                          boxSize={5}
                        />
                        <Heading size="md" color="gray.700">
                          Additional Services
                        </Heading>
                      </HStack>

                      <Card variant="outline" borderColor={borderColor}>
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <Box flex={1}>
                              <Text fontWeight="semibold" mb={1}>
                                GPS Navigation
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Add GPS for easier navigation during your trip
                              </Text>
                              <Badge colorScheme="blue" mt={1}>
                                +₱200
                              </Badge>
                            </Box>
                            <Switch
                              isChecked={needGPS}
                              onChange={(e) => setNeedGPS(e.target.checked)}
                              size="md"
                              colorScheme="blue"
                            />
                          </HStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline" borderColor={borderColor}>
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <Box flex={1}>
                              <Text fontWeight="semibold" mb={1}>
                                Baby Seat
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Safety seat for infants and young children
                              </Text>
                              <Badge colorScheme="blue" mt={1}>
                                +₱150
                              </Badge>
                            </Box>
                            <Switch
                              isChecked={needSeat}
                              onChange={(e) => setNeedSeat(e.target.checked)}
                              size="md"
                              colorScheme="blue"
                            />
                          </HStack>
                        </CardBody>
                      </Card>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="medium">
                          Special Requests
                        </FormLabel>
                        <Textarea
                          placeholder="Any special requests or instructions for your booking..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          size="md"
                          rows={4}
                        />
                        <FormHelperText>
                          Optional: Let us know if you have any special
                          requirements
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  )}

                  {activeStep === 3 && (
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

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={4}
                      >
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Pickup
                          </Text>
                          <Text fontWeight="medium">
                            {pickupAt
                              ? new Date(pickupAt).toLocaleString()
                              : "-"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Return
                          </Text>
                          <Text fontWeight="medium">
                            {returnAt
                              ? new Date(returnAt).toLocaleString()
                              : "-"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Pickup Location
                          </Text>
                          <Text fontWeight="medium">
                            {pickupLocation || "-"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Drop-off Location
                          </Text>
                          <Text fontWeight="medium">
                            {dropoffLocation || "-"}
                          </Text>
                        </Box>
                      </Grid>

                      <Divider />

                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          Renter Information
                        </Text>
                        <Text fontWeight="medium">{renterName || "-"}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {renterPhone || "-"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {idType}: {idNumber || "-"}
                        </Text>
                      </Box>

                      <Divider />

                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Additional Services
                        </Text>
                        <VStack align="stretch" spacing={1}>
                          <HStack justify="space-between">
                            <Text fontSize="sm">GPS Navigation</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {needGPS ? "₱200" : "Not selected"}
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm">Baby Seat</Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {needSeat ? "₱150" : "Not selected"}
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Pricing Summary (moved from sidebar) */}
                      <Card
                        variant="subtle"
                        bg={cardBg}
                        borderColor={borderColor}
                      >
                        <CardHeader pb={2}>
                          <Heading size="sm">Pricing Summary</Heading>
                        </CardHeader>
                        <CardBody pt={0}>
                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                {quantities.qty} {quantities.label} x{" "}
                                {baseRate.toLocaleString()}
                              </Text>
                              <Text fontWeight="semibold">
                                {(quantities.qty * baseRate).toLocaleString()}
                              </Text>
                            </HStack>
                            {extrasCharge > 0 && (
                              <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                  Additional services
                                </Text>
                                <Text fontWeight="semibold">
                                  {extrasCharge.toLocaleString()}
                                </Text>
                              </HStack>
                            )}
                            <Divider />
                            <HStack justify="space-between">
                              <Text fontWeight="bold">Total</Text>
                              <Text fontWeight="bold" color="green.600">
                                {total.toLocaleString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {notes && (
                        <>
                          <Divider />
                          <Box>
                            <Text fontSize="sm" color="gray.600" mb={1}>
                              Special Requests
                            </Text>
                            <Text fontSize="sm" fontStyle="italic">
                              {notes}
                            </Text>
                          </Box>
                        </>
                      )}
                    </Stack>
                  )}

                  {/* Navigation Buttons */}
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
                          setActiveStep((s) =>
                            Math.min(steps.length - 1, s + 1)
                          );
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
                      <Button
                        colorScheme="green"
                        onClick={handleConfirm}
                        isDisabled={!canSubmit}
                        size="md"
                      >
                        Confirm Booking
                      </Button>
                    )}
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </GridItem>

          {/* Sidebar */}
          {false && (
            <GridItem bg={sidebarBg}>
              <Box p={6} position="sticky" top={0}>
                <Stack spacing={6}>
                  {/* Vehicle Card */}
                  <Card variant="filled" bg={cardBg}>
                    <Image
                      src={car?.image}
                      alt={car?.name}
                      objectFit="cover"
                      w="100%"
                      h="140px"
                      borderTopRadius="md"
                    />
                    <CardBody>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="gray.700"
                        mb={2}
                      >
                        {car?.name}
                      </Text>
                      {/* CarRates removed in compact layout */}
                    </CardBody>
                  </Card>

                  {/* Pricing Summary */}
                  <Card variant="filled" bg={cardBg}>
                    <CardHeader pb={3}>
                      <Heading size="sm">Pricing Summary</Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="gray.600">
                            {quantities.qty} {quantities.label} × ₱
                            {baseRate.toLocaleString()}
                          </Text>
                          <Text fontWeight="semibold">
                            ₱{(quantities.qty * baseRate).toLocaleString()}
                          </Text>
                        </HStack>

                        {extrasCharge > 0 && (
                          <HStack justify="space-between">
                            <Text fontSize="sm" color="gray.600">
                              Additional services
                            </Text>
                            <Text fontWeight="semibold">
                              ₱{extrasCharge.toLocaleString()}
                            </Text>
                          </HStack>
                        )}

                        <Divider />

                        <HStack justify="space-between">
                          <Text fontWeight="bold" fontSize="lg">
                            Total
                          </Text>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="green.600"
                          >
                            ₱{total.toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Quick Actions */}
                  <Stack spacing={3}>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      isDisabled={!canSubmit}
                      onClick={handleConfirm}
                      w="full"
                    >
                      Confirm Booking
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      size="lg"
                      w="full"
                    >
                      Cancel
                    </Button>
                  </Stack>

                  {/* Help Text */}
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    You can modify your booking details until confirmation
                  </Text>
                </Stack>
              </Box>
            </GridItem>
          )}
        </Grid>
      </Box>
    </BaseModal>
  );
};

export default BookingModal;
