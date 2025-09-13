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
  Badge,
} from "@chakra-ui/react";

import BaseModal from "../../base/BaseModal";
import CarRates from "../cardview/CarRates";
import PaymentPanel from "../payment/PaymentPanel";

const toNumber = (str = "0") => Number(String(str).replace(/,/g, "").trim()) || 0;

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

const BookingModal = ({ isOpen, onClose, car = {} }) => {
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

  const baseRate = toNumber(car?.rateAmount);

  const quantities = useMemo(() => {
    if (!pickupAt || !returnAt) return { qty: 0, label: car?.rateType || "" };
    if ((car?.rateType || "").toLowerCase() === "hourly") {
      const hrs = hoursBetween(pickupAt, returnAt);
      return { qty: hrs, label: "hour(s)" };
    }
    // default daily
    const d = daysBetween(pickupAt, returnAt);
    return { qty: d, label: "day(s)" };
  }, [pickupAt, returnAt, car?.rateType]);

  const extrasCharge = (needGPS ? 200 : 0) + (needSeat ? 150 : 0);

  const total = useMemo(() => {
    const qty = quantities.qty;
    if (!qty || !baseRate) return 0;
    return qty * baseRate + extrasCharge;
  }, [quantities.qty, baseRate, extrasCharge]);

  const canSubmit =
    renterName.trim().length > 1 &&
    renterPhone.trim().length >= 7 &&
    pickupAt &&
    returnAt &&
    quantities.qty > 0;

  const handleConfirm = () => {
    // This is UI-only for now. Hook into API here later.
    // eslint-disable-next-line no-console
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
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      hassFooter={false}
    >
      <Box p={5} bg="white">
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          <GridItem>
            <Stack spacing={5}>
              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={3} color="gray.700">
                  Trip Details
                </Text>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Pickup date & time
                    </Text>
                    <Input
                      type="datetime-local"
                      value={pickupAt}
                      onChange={(e) => setPickupAt(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Return date & time
                    </Text>
                    <Input
                      type="datetime-local"
                      value={returnAt}
                      onChange={(e) => setReturnAt(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Pickup location
                    </Text>
                    <Input
                      placeholder="e.g. Downtown Branch"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Drop-off location
                    </Text>
                    <Input
                      placeholder="Same as pickup or different"
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                    />
                  </Box>
                </Grid>

                <HStack mt={3} spacing={4}>
                  <Badge colorScheme="blue" fontSize="0.8em">
                    {car?.rateType || "Daily"} rate
                  </Badge>
                  {quantities.qty > 0 && (
                    <Text fontSize="sm" color="gray.600">
                      Duration: {quantities.qty} {quantities.label}
                    </Text>
                  )}
                </HStack>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={3} color="gray.700">
                  Renter Details
                </Text>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Full name
                    </Text>
                    <Input
                      placeholder="John Doe"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Phone number
                    </Text>
                    <Input
                      placeholder="09XX-XXX-XXXX"
                      value={renterPhone}
                      onChange={(e) => setRenterPhone(e.target.value)}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      ID type
                    </Text>
                    <Select value={idType} onChange={(e) => setIdType(e.target.value)}>
                      <option>Driver License</option>
                      <option>Passport</option>
                      <option>National ID</option>
                    </Select>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      ID number
                    </Text>
                    <Input
                      placeholder="ID / License number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={3} color="gray.700">
                  Extras
                </Text>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="semibold">GPS Navigation</Text>
                      <Text fontSize="sm" color="gray.600">
                        Add GPS for easier navigation (+200)
                      </Text>
                    </Box>
                    <Switch isChecked={needGPS} onChange={(e) => setNeedGPS(e.target.checked)} />
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="semibold">Baby Seat</Text>
                      <Text fontSize="sm" color="gray.600">
                        Safety seat for infants (+150)
                      </Text>
                    </Box>
                    <Switch isChecked={needSeat} onChange={(e) => setNeedSeat(e.target.checked)} />
                  </HStack>
                </VStack>
              </Box>

              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={3} color="gray.700">
                  Notes (optional)
                </Text>
                <Textarea
                  placeholder="Any special requests or instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Stack spacing={4} position="sticky" top={0}>
              <Box borderWidth="1px" borderRadius="md" overflow="hidden">
                <Image src={car?.image} alt={car?.name} objectFit="cover" w="100%" h="160px" />
                <Box p={3}>
                  <Text fontWeight="bold" color="gray.700">
                    {car?.name}
                  </Text>
                  <CarRates rateAmount={car?.rateAmount} rateType={car?.rateType} />
                </Box>
              </Box>

              <PaymentPanel
                title="Estimated Charges"
                rateAmount={(quantities.qty * baseRate).toLocaleString()}
                extraCharge={extrasCharge.toLocaleString()}
                bgColor="gray.50"
              />

              <Button
                colorScheme="blue"
                size="md"
                isDisabled={!canSubmit}
                onClick={handleConfirm}
              >
                Confirm Booking
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </BaseModal>
  );
};

export default BookingModal;

