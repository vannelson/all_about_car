import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Skeleton, SkeletonText, HStack } from "@chakra-ui/react";

const CarCardSkeleton = () => {
  return (
    <Card borderRadius="lg" overflow="hidden">
      <CardHeader p={0} h="180px">
        <Skeleton w="100%" h="100%" />
      </CardHeader>
      <CardBody>
        <Skeleton height="18px" mb={2} />
        <SkeletonText noOfLines={3} spacing="2" />
        <Skeleton height="10px" my={3} />
        <SkeletonText noOfLines={2} spacing="2" />
      </CardBody>
      <CardFooter>
        <HStack w="full" spacing={3}>
          <Skeleton height="32px" flex="1" />
          <Skeleton height="32px" flex="1" />
          <Skeleton height="32px" flex="1" />
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default CarCardSkeleton;

