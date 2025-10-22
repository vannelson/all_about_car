import { Box, Flex, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";

function UpcomingBookingsSkeleton({ count = 3 }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={`upcoming-skeleton-${index}`}
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.100"
          bg="white"
          p={{ base: 4, md: 5 }}
        >
          <Stack spacing={4}>
            <Flex
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Stack spacing={2} width="full">
                <Skeleton height="12px" width="80px" borderRadius="full" />
                <Skeleton height="18px" width="160px" />
                <Skeleton height="12px" width="120px" />
              </Stack>
              <Stack spacing={2} align="flex-end" width={{ base: "full", md: "auto" }}>
                <Skeleton height="12px" width="100px" />
                <Skeleton height="18px" width="140px" />
              </Stack>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              {Array.from({ length: 3 }).map((__, cellIdx) => (
                <Box
                  key={`upcoming-skeleton-cell-${index}-${cellIdx}`}
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="lg"
                  p={3}
                >
                  <Skeleton height="10px" width="50%" />
                  <Skeleton height="12px" width="80%" mt={3} />
                </Box>
              ))}
            </SimpleGrid>
            <Flex justify="space-between" align="center" gap={3}>
              <Skeleton height="12px" width="45%" />
              <Skeleton height="12px" width="25%" />
            </Flex>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default UpcomingBookingsSkeleton;
