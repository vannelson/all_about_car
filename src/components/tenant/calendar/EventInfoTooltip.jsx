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
} from "@chakra-ui/react";
import { FiUser, FiPhone, FiCreditCard } from "react-icons/fi";

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

export default function EventInfoTooltip({ isOpen, onClose, anchor = { x: 0, y: 0 }, booking }) {
  const b = booking || {};
  const name = fullName(b);
  const phone = b?.renter_phone_number || b?.renter_phone || "-";
  const payStatus = b?.payment_status || "";
  const status = b?.status || "";
  const total = fmtMoney(b?.total_amount);
  const base = fmtMoney(b?.base_amount);
  const extra = fmtMoney(b?.extra_payment);
  const discount = fmtMoney(b?.discount);

  const statusColor = String(status).toLowerCase() === "completed"
    ? "green"
    : String(status).toLowerCase() === "ongoing"
    ? "orange"
    : String(status).toLowerCase() === "cancelled"
    ? "red"
    : "gray";

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="auto" closeOnBlur>
      <PopoverTrigger>
        <Box position="absolute" left={anchor.x} top={anchor.y} width="1px" height="1px" />
      </PopoverTrigger>
      <PopoverContent width="300px" p={0} borderRadius="md" shadow="lg">
        <PopoverArrow />
        <PopoverBody p={3}>
          <VStack spacing={2} align="stretch">
            <HStack spacing={2}>
              <Icon as={FiUser} />
              <Text fontWeight="semibold" noOfLines={1} title={name}>
                {name}
              </Text>
              {status ? <Badge ml="auto" colorScheme={statusColor}>{status}</Badge> : null}
            </HStack>
            <HStack spacing={2} color="gray.600">
              <Icon as={FiPhone} />
              <Text fontSize="sm">{phone}</Text>
            </HStack>
            <Divider />
            <HStack spacing={2}>
              <Icon as={FiCreditCard} />
              <Text fontWeight="semibold">Payment</Text>
              {payStatus ? (
                <Badge ml="auto" colorScheme={String(payStatus).toLowerCase() === "paid" ? "green" : "gray"}>
                  {payStatus}
                </Badge>
              ) : null}
            </HStack>
            <HStack justify="space-between"><Text fontSize="sm" color="gray.600">Base</Text><Text fontSize="sm">{base}</Text></HStack>
            <HStack justify="space-between"><Text fontSize="sm" color="gray.600">Extra</Text><Text fontSize="sm">{extra}</Text></HStack>
            <HStack justify="space-between"><Text fontSize="sm" color="gray.600">Discount</Text><Text fontSize="sm">{discount}</Text></HStack>
            <HStack justify="space-between"><Text fontWeight="semibold">Total</Text><Text fontWeight="semibold" color="green.600">{total}</Text></HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

