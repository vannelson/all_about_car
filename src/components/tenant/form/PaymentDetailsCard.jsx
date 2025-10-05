import { Card, CardHeader, CardBody, Heading, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { FaMoneyBillWave, FaClock, FaTag } from "react-icons/fa";
import InfoRow from "./InfoRow";

export default function PaymentDetailsCard({ panelBg, baseRate = 0, chosenRateType = "daily", quantities = { qty: 0, label: "day(s)" }, extraPayment = 0, total = 0 }) {
  const qty = Number(quantities?.qty || 0);
  const label = quantities?.label || "";
  const baseAmount = qty * (Number(baseRate) || 0);
  const extra = Number(extraPayment) || 0;
  const final = Number(total) || baseAmount + extra;

  return (
    <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
      <CardHeader pb={2}><Heading size="sm">Payment Details</Heading></CardHeader>
      <CardBody pt={0}>
        <VStack spacing={0} align="stretch">
          <InfoRow icon={FaMoneyBillWave} label="Rate" value={`${(Number(baseRate)||0).toLocaleString()} / ${chosenRateType}`} />
          <InfoRow icon={FaClock} label="Quantity" value={`${qty} ${label}`} />
          <InfoRow icon={FaTag} label="Base Amount" value={baseAmount.toLocaleString()} />
          <InfoRow icon={FaTag} label="Extra Payment" value={extra.toLocaleString()} />
          <HStack justify="space-between" pt={3}>
            <HStack spacing={2}><Icon as={FaMoneyBillWave} color="green.600" boxSize={4} /><Text fontWeight="bold">Total</Text></HStack>
            <Text fontWeight="bold" color="green.600">{final.toLocaleString()}</Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

