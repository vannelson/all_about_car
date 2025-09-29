import React from "react";
import { HStack, VStack, Text, Tag, TagLabel, useColorModeValue } from "@chakra-ui/react";

const CarIdentity = ({ brand, model, type }) => {
  const brandColor = useColorModeValue("gray.900", "white");
  const modelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <HStack w="full" justify="space-between" align="start" mb={2} spacing={3}>
      <VStack align="start" spacing={0} flex={1} minW={0}>
        <Text fontWeight="semibold" fontSize="md" color={brandColor} noOfLines={1}>
          {brand || "-"}
        </Text>
        {model ? (
          <Text fontSize="sm" color={modelColor} noOfLines={1}>
            {model}
          </Text>
        ) : null}
      </VStack>
      {type ? (
        <Tag size="sm" variant="subtle" colorScheme="gray" flexShrink={0}>
          <TagLabel>{type}</TagLabel>
        </Tag>
      ) : null}
    </HStack>
  );
};

export default CarIdentity;

