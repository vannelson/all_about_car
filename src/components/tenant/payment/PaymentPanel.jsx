import { useState } from "react";
import { Box, Text, Flex, Divider } from "@chakra-ui/react";
import {
  FaCalculator,
  FaMoneyBillWave,
  FaExclamationCircle,
} from "react-icons/fa";
const PaymentPanel = ({
  title = "",
  rateAmount,
  extraCharge,
  bgColor = "white",
}) => {
  const parseAmount = (str = "0") =>
    Number(String(str).replace(/,/g, "").trim()) || 0;

  const totalCharge = parseAmount(rateAmount) + parseAmount(extraCharge);

  return (
    <Box p={3} borderWidth="1px" borderRadius="md" bg={bgColor}>
      {title === "" ? (
        ""
      ) : (
        <Text fontWeight="bold" fontSize="14" mb={2}>
          {title}
        </Text>
      )}

      <Flex align="center" justify="space-between">
        <Flex align="center" gap={2}>
          <FaMoneyBillWave fontSize="16" />
          <Text>Charge</Text>
        </Flex>
        <Text fontWeight="medium">{rateAmount}</Text>
      </Flex>

      <Flex align="center" justify="space-between" mt={1}>
        <Flex align="center" gap={2}>
          <FaExclamationCircle fontSize="16" color="orange" />
          <Text>Extra </Text>
        </Flex>
        <Text fontWeight="medium">{extraCharge}</Text>
      </Flex>
      <Divider my={2} />
      <Flex align="center" justify="space-between" mt={1}>
        <Flex align="center" gap={2}>
          <FaCalculator fontSize="16" />
          <Text>Total</Text>
        </Flex>
        <Text fontWeight="bold">{totalCharge.toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};

export default PaymentPanel;
