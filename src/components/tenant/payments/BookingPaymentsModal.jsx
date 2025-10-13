import {
  Box,
  Text,
  Stack,
  Badge,
  SimpleGrid,
  GridItem,
  HStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FiCreditCard,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import BaseModal from "../../base/BaseModal";
import BookingPaymentsPanel from "./BookingPaymentsPanel";
import PaymentDetailsCard from "../form/PaymentDetailsCard";
import RenterInfoCard from "../form/RenterInfoCard";
import { selectPaymentsByBooking } from "../../../store/paymentsSlice";

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value || "-");
  }
}

export default function BookingPaymentsModal({
  bookingId,
  booking,
  isOpen,
  onClose,
}) {
  const paymentsState = useSelector(selectPaymentsByBooking(bookingId));
  const payments = paymentsState?.items || [];

  const totalPaid = useMemo(
    () =>
      payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    [payments]
  );

  const totalAmount = Number(booking?.total_amount || 0);
  const outstanding = Math.max(totalAmount - totalPaid, 0);
  const renterName = [booking?.renter_first_name, booking?.renter_last_name]
    .filter(Boolean)
    .join(" ");
  const discountValue = Number(booking?.discount || 0);
  const baseAmount = Number(booking?.base_amount || 0);
  const extraPayment = Number(booking?.extra_payment || 0);

  const paymentRows = useMemo(() => {
    const rows = [
      { icon: FaTag, label: "Base", value: formatMoney(baseAmount) },
      { icon: FaTag, label: "Extra", value: formatMoney(extraPayment) },
    ];
    if (discountValue) {
      rows.push({
        icon: FaTag,
        label: "Discount",
        value: `-${formatMoney(Math.abs(discountValue))}`,
      });
    }
    rows.push({
      icon: FiDollarSign,
      label: "Paid",
      value: formatMoney(totalPaid),
      valueColor: "green.600",
    });
    rows.push({
      icon: FiDollarSign,
      label: "Outstanding",
      value: formatMoney(outstanding),
      valueColor: outstanding === 0 ? "green.600" : "orange.500",
      showDivider: true,
    });
    return rows;
  }, [baseAmount, extraPayment, discountValue, totalPaid, outstanding]);

  const paymentStatusColor = useMemo(() => {
    const statusValue = String(booking?.payment_status || "").toLowerCase();
    if (statusValue === "paid") return "green";
    if (statusValue === "pending") return "orange";
    if (statusValue === "failed") return "red";
    return "purple";
  }, [booking?.payment_status]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      title="Payments"
      hassFooter={false}
    >
      <SimpleGrid
        columns={{ base: 1, md: 5 }}
        spacing={6}
        alignItems="flex-start"
      >
        <GridItem colSpan={{ base: 1, md: 3 }}>
          <Box bg="white" borderRadius="lg" p={{ base: 3, md: 4 }} shadow="sm">
            <BookingPaymentsPanel bookingId={bookingId} booking={booking} />
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Stack spacing={6}>
            <Stack
              spacing={4}
              bg="white"
              borderRadius="lg"
              p={{ base: 4, md: 5 }}
              shadow="sm"
            >
              <Box
                bg="blue.50"
                borderRadius="md"
                px={4}
                py={3}
                border="1px solid"
                borderColor="blue.100"
              >
                <HStack justify="space-between" align="center">
                  <HStack spacing={3} align="center">
                    <Box
                      bg="blue.500"
                      color="white"
                      borderRadius="full"
                      p={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FiCreditCard} boxSize={4} />
                    </Box>
                    <Stack spacing={0}>
                      <Text fontSize="xs" color="blue.600" letterSpacing="wider" textTransform="uppercase">
                        Booking
                      </Text>
                      <Text fontWeight="semibold" color="gray.800">
                        Summary
                      </Text>
                    </Stack>
                  </HStack>
                  <HStack spacing={2}>
                    {booking?.status ? (
                      <Badge colorScheme="blue" variant="subtle">
                        {booking.status}
                      </Badge>
                    ) : null}
                    {booking?.payment_status ? (
                      <Badge colorScheme={paymentStatusColor} variant="solid">
                        {booking.payment_status}
                      </Badge>
                    ) : null}
                  </HStack>
                </HStack>
              </Box>
              <PaymentDetailsCard
                panelBg="transparent"
                heading="Payment Summary"
                rows={paymentRows}
                total={totalAmount}
                totalLabel="Total Amount"
              />
              <RenterInfoCard
                panelBg="white"
                renterFirstName={booking?.renter_first_name}
                renterMiddleName={booking?.renter_middle_name}
                renterLastName={booking?.renter_last_name}
                renterPhone={booking?.renter_phone_number}
                renterEmail={booking?.renter_email}
                renterAddress={booking?.renter_address}
                idType={booking?.identification_type}
                idNumber={booking?.identification_number}
              />
            </Stack>
          </Stack>
        </GridItem>
      </SimpleGrid>
    </BaseModal>
  );
}
