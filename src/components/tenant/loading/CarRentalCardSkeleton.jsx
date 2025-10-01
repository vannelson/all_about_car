import { Card, Box, Flex, VStack, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function CarRentalCardSkeleton({ height = 150 }) {
  return (
    <Card
      variant="unstyled"
      w="100%"
      h={`${height}px`}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
    >
      <Flex h="100%">
        <Box pos="relative" w="150px" h="100%" className="shrink-0">
          <Skeleton h="100%" w="100%" />
        </Box>
        <Flex flex="1" justify="space-between" p={2}>
          <VStack align="flex-start" spacing={2} flex="1" pr={2}>
            <Skeleton h="14px" w="50%" borderRadius="md" />
            <SkeletonText noOfLines={3} spacing="2" skeletonHeight="3" w="80%" />
          </VStack>
          <VStack align="flex-end" justify="space-between" w="110px" py={2}>
            <Skeleton h="18px" w="70px" borderRadius="md" />
            <Skeleton h="28px" w="64px" borderRadius="md" />
          </VStack>
        </Flex>
      </Flex>
    </Card>
  );
}

