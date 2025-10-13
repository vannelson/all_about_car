import { Card, CardHeader, CardBody, Heading, VStack } from "@chakra-ui/react";
import { FaMoneyBillWave, FaClock, FaTag } from "react-icons/fa";
import InfoRow from "./InfoRow";

export default function PaymentDetailsCard({
  panelBg,
  heading = "Payment Details",
  rows,
  baseRate = null,
  chosenRateType = "daily",
  quantities = { qty: 0, label: "day(s)" },
  baseAmount = null,
  extraPayment = 0,
  discount = null,
  total = null,
  totalLabel = "Total",
}) {
  const qty = Number(quantities?.qty || 0);
  const label = quantities?.label || "";
  const resolvedBaseRate = baseRate != null ? Number(baseRate) : null;
  const computedBaseAmount =
    baseAmount != null ? Number(baseAmount) : qty * (Number(resolvedBaseRate || 0));
  const extra = Number(extraPayment) || 0;
  const discountValue = discount != null ? Number(discount) : null;
  const final =
    total != null
      ? Number(total)
      : computedBaseAmount + extra - (discountValue != null ? discountValue : 0);

  const defaultRows = [];

  if (resolvedBaseRate != null) {
    defaultRows.push({
      icon: FaMoneyBillWave,
      label: "Rate",
      value: `${resolvedBaseRate.toLocaleString()} / ${chosenRateType}`,
    });
  }
  if (resolvedBaseRate != null || qty > 0) {
    defaultRows.push({
      icon: FaClock,
      label: "Quantity",
      value: `${qty} ${label}`,
    });
  }

  defaultRows.push({
    icon: FaTag,
    label: "Base Amount",
    value: computedBaseAmount.toLocaleString(),
  });

  defaultRows.push({
    icon: FaTag,
    label: "Extra Payment",
    value: extra.toLocaleString(),
  });

  if (discountValue != null) {
    defaultRows.push({
      icon: FaTag,
      label: "Discount",
      value: `-${Math.abs(discountValue).toLocaleString()}`,
    });
  }

  const displayRows = rows && rows.length ? rows : defaultRows;

  return (
    <Card variant="unstyled" bg={panelBg} border="0" shadow="sm" borderRadius="md">
      <CardHeader pb={2}>
        <Heading size="sm">{heading}</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={0} align="stretch">
          {displayRows.map((row, index) => (
            <InfoRow
              key={row.label || index}
              icon={row.icon}
              label={row.label}
              value={row.value}
              emphasize={row.emphasize}
              showDivider={
                row.showDivider ?? (index !== displayRows.length - 1 || total == null)
              }
              valueColor={row.valueColor}
            />
          ))}
          {total != null ? (
            <InfoRow
              icon={FaMoneyBillWave}
              label={totalLabel}
              value={final.toLocaleString()}
              emphasize
              showDivider={false}
            />
          ) : null}
        </VStack>
      </CardBody>
    </Card>
  );
}



