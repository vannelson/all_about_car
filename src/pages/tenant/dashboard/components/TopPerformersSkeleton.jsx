import { Box, Flex, HStack, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";

function TopPerformersSkeleton({ count = 3 }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={`performer-skeleton-${index}`}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.100"
          bg="white"
          px={4}
          py={5}
        >
          <Stack spacing={4}>
            <Flex
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <HStack spacing={3} align="center">
                <Skeleton boxSize="48px" borderRadius="full" />
                <Stack spacing={2}>
                  <Skeleton height="12px" width="60px" borderRadius="full" />
                  <Skeleton height="16px" width="140px" />
                  <Skeleton height="10px" width="80px" />
                </Stack>
              </HStack>
              <Stack spacing={2} align="flex-end">
                <Skeleton height="10px" width="70px" />
                <Skeleton height="18px" width="120px" />
                <Skeleton height="10px" width="90px" />
              </Stack>
            </Flex>
            <Skeleton height="6px" borderRadius="full" />
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
              {Array.from({ length: 3 }).map((__, cellIdx) => (
                <Box
                  key={`performer-skeleton-cell-${index}-${cellIdx}`}
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="lg"
                  p={3}
                >
                  <Skeleton height="10px" width="60%" />
                  <Skeleton height="12px" width="70%" mt={3} />
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default TopPerformersSkeleton;
