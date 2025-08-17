import { Box, Text, Flex } from "@chakra-ui/react";
import { carIcons } from "../../utils/carIcons";

import {
  FaGasPump,
  FaCogs,
  FaSuitcase,
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaTachometerAlt,
  FaBook,
  FaCalculator,
  FaMoneyBillWave,
  FaClock,
  FaExclamationCircle,
  FaCalendarDay,
} from "react-icons/fa";

const BaseListAndIcons = ({ specs = [], fontSize = "16" }) => {
  return (
    <>
      {specs.map((spec, i) => {
        const Icon = carIcons[spec.key];
        return (
          <Flex key={i} align="center" gap={2} mb={2}>
            {Icon && <Icon fontSize={fontSize} />}
            <Text>{spec.value}</Text>
          </Flex>
        );
      })}
    </>
  );
};

export default BaseListAndIcons;
