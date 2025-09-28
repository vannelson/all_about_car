import React from "react";
import { Tr, Td, Flex, Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

const TableCarRowSkeleton = ({ keyPrefix = "sk" }) => {
  return (
    <Tr>
      <Td>
        <Flex align="flex-start" gap={3}>
          <Skeleton boxSize="80px" borderRadius="md" />
          <Box flex="1">
            <Skeleton height="16px" mb={2} />
            <SkeletonText noOfLines={2} spacing="2" />
          </Box>
        </Flex>
      </Td>
      <Td>
        <SkeletonText noOfLines={2} spacing="2" />
      </Td>
      <Td>
        <SkeletonText noOfLines={2} spacing="2" />
      </Td>
      <Td>
        <SkeletonText noOfLines={2} spacing="2" />
      </Td>
      <Td>
        <Skeleton height="24px" width="80px" />
      </Td>
      <Td>
        <Stack direction="column" spacing={2} align="center">
          <Skeleton height="28px" width="72px" />
          <Skeleton height="28px" width="72px" />
          <Skeleton height="28px" width="72px" />
        </Stack>
      </Td>
    </Tr>
  );
};

export default TableCarRowSkeleton;

