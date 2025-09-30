import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { carIcons } from "../../utils/carIcons";

import {} from "react-icons/fa";

const BaseListAndIcons = ({
  specs = [],
  IconfontSize = 16,
  labelFontSize = 14,
  IconColor = "#4A5568",
  mb = 2,
  gap = 2,
  showMode = "all", // "all" | number
}) => {
  const [expanded, setExpanded] = useState(false);

  let displayedSpecs = specs;

  if (showMode !== "all") {
    displayedSpecs = expanded ? specs : specs.slice(0, showMode);
  }

  return (
    <Box>
      {displayedSpecs.map((spec, i) => {
        const Icon = carIcons[spec.key];
        return (
          <Flex key={i} align="center" gap={gap} mb={mb}>
            {Icon && <Icon fontSize={IconfontSize} color={IconColor} />}
            <Text fontSize={labelFontSize}>{spec.value}</Text>
          </Flex>
        );
      })}

      {showMode !== "all" && specs.length > showMode && (
        <Button
          onClick={() => setExpanded(!expanded)}
          size="xl"
          variant="link"
          colorScheme="gray"
          mt={2}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

export default BaseListAndIcons;
