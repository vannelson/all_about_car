import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Divider,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  FiUser,
  FiPhone,
  FiCreditCard,
  FiMail,
  FiClock,
  FiLock,
  FiUnlock,
  FiSave,
  FiEdit2,
} from "react-icons/fi";
import { daysBetween, formatDateTimeLocalToApi } from "../../../utils/booking";
import { updateBookingApi } from "../../../services/bookings";
import { useEffect, useMemo, useState } from "react";

function fmtMoney(n) {
  const num = Number(n ?? 0) || 0;
  return num.toLocaleString();
}

function fullName(b = {}) {
  const fn = [b?.renter_first_name, b?.renter_middle_name, b?.renter_last_name]
    .filter(Boolean)
    .join(" ");
  return fn || "Renter";
}

export default function EventInfoTooltip({
  isOpen,
  onClose,
  anchor = { x: 0, y: 0 },
  booking,
}) {
  const b = booking || {};
  const toast = useToast();
  const name = fullName(b);
  const phone = b?.renter_phone_number || b?.renter_phone || "-";
  const email = b?.renter_email || "-";
  const payStatus = b?.payment_status || "";
  const status = b?.status || "";
  const total = fmtMoney(b?.total_amount);
  const base = fmtMoney(b?.base_amount);
  const extra = fmtMoney(b?.extra_payment);
  const discount = fmtMoney(b?.discount);
  const dayCount = (() => {
    try {
      const d = daysBetween(b?.start_date, b?.end_date);
      return Number.isFinite(d) ? d : 0;
    } catch {
      return 0;
    }
  })();

  const statusColor =
    String(status).toLowerCase() === "completed"
      ? "green"
      : String(status).toLowerCase() === "ongoing"
      ? "orange"
      : String(status).toLowerCase() === "cancelled"
      ? "red"
      : "gray";

  // Local edit state
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState(status || "");
  const initialReturnLocal = useMemo(() => {
    try {
      if (!b?.actual_return_date) return "";
      const d = new Date(b.actual_return_date);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  }, [b?.actual_return_date]);
  const [editReturn, setEditReturn] = useState(initialReturnLocal);

  useEffect(() => {
    setEditStatus(status || "");
    setEditReturn(initialReturnLocal);
  }, [status, initialReturnLocal]);

  const handleSave = async () => {
    if (!b?.id) return;
    try {
      setSaving(true);
      const payload = {};
      if (editStatus && editStatus !== status) payload.status = editStatus;
      if (editReturn)
        payload.actual_return_date = formatDateTimeLocalToApi(editReturn);
      await updateBookingApi({ id: b.id, ...payload });
      // Broadcast to calendar to refresh local event data
      try {
        const ev = new CustomEvent("tc:bookingUpdated", {
          detail: { id: b.id, ...payload },
        });
        window.dispatchEvent(ev);
      } catch {}
      toast({ title: "Booking updated", status: "success" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking";
      toast({ title: msg, status: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="auto" closeOnBlur>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={anchor.x}
          top={anchor.y}
          width="1px"
          height="1px"
        />
      </PopoverTrigger>
      <PopoverContent width="320px" p={0} borderRadius="md" shadow="lg">
        <PopoverArrow />
        <PopoverBody p={3}>
          <VStack spacing={2} align="stretch">
            <HStack spacing={2}>
              <Icon as={FiUser} />
              <Text fontWeight="semibold" noOfLines={1} title={name}>
                {name}
              </Text>
              {status ? (
                <Badge ml="auto" colorScheme={statusColor}>
                  {status}
                </Badge>
              ) : null}
            </HStack>
            <HStack spacing={2} color="gray.600">
              <Icon as={FiPhone} />
              <Text fontSize="sm">{phone}</Text>
            </HStack>
            <HStack spacing={2} color="gray.600">
              <Icon as={FiMail} />
              <Text fontSize="sm">{email}</Text>
            </HStack>
            {dayCount > 0 ? (
              <HStack spacing={2} color="gray.600">
                <Icon as={FiClock} />
                <Text fontSize="sm">
                  {dayCount} day{dayCount === 1 ? "" : "s"}
                </Text>
              </HStack>
            ) : null}
            <Divider />
            <HStack spacing={2}>
              <Icon as={FiCreditCard} />
              <Text fontWeight="semibold">Payment</Text>
              {payStatus ? (
                <Badge
                  ml="auto"
                  colorScheme={
                    String(payStatus).toLowerCase() === "paid"
                      ? "green"
                      : "gray"
                  }
                >
                  {payStatus}
                </Badge>
              ) : null}
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Base
              </Text>
              <Text fontSize="sm">{base}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Extra
              </Text>
              <Text fontSize="sm">{extra}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Discount
              </Text>
              <Text fontSize="sm">{discount}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">Total</Text>
              <Text fontWeight="semibold" color="green.600">
                {total}
              </Text>
            </HStack>

            <Divider />
            <Box
              bg="gray.50"
              borderWidth="1px"
              borderColor="gray.100"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              p={2}
              borderRadius="md"
            >
              <HStack justify="space-between" mb={2}>
                <HStack spacing={2}>
                  <Icon as={FiEdit2} />
                  <Text fontWeight="semibold">Update</Text>
                </HStack>
                <Button
                  size="xs"
                  variant="ghost"
                  leftIcon={<Icon as={locked ? FiLock : FiUnlock} />}
                  onClick={() => setLocked((v) => !v)}
                >
                  {locked ? "Locked" : "Unlocked"}
                </Button>
              </HStack>
              <VStack spacing={2} align="stretch">
                <HStack>
                  <Text fontSize="xs" color="gray.600" minW="35px">
                    Status
                  </Text>
                  <Select
                    size="sm"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    isDisabled={locked}
                  >
                    <option value="">Select status</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </HStack>
                <HStack>
                  <Text fontSize="xs" color="gray.600" minW="35px">
                    Return
                  </Text>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiClock} color="gray.500" boxSize={4} />
                    </InputLeftElement>
                    <Input
                      type="datetime-local"
                      value={editReturn}
                      onChange={(e) => setEditReturn(e.target.value)}
                      isDisabled={locked}
                    />
                  </InputGroup>
                </HStack>
                <HStack justify="flex-end" pt={1}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<FiSave />}
                    onClick={handleSave}
                    isLoading={saving}
                    isDisabled={locked || !b?.id}
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
