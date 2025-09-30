import {
  Box,
  Card,
  Button,
  Text,
  Image,
  Icon,
  HStack,
  VStack,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

export default function CarRentalCardBooking() {
  const cardDirection = useBreakpointValue({ base: "column", md: "row" });

  return (
    <Box p={2}>
      <Card
        direction={cardDirection}
        overflow="hidden"
        variant="outline"
        borderRadius="md"
        w="100%"
        maxW="500px"
        h="150px"
        mx="auto"
        boxShadow="sm"
      >
        {/* Image Section */}
        <Box
          position="relative"
          flexShrink={0}
          w={{ base: "100%", md: "200px" }}
          h="150px"
          p={2}
        >
          <Image
            objectFit="cover"
            w="100%"
            h="100%"
            src="http://127.0.0.1:8000/storage/cars/33/profileImage/wEEYlX0LEWeCjplwAVa21ErwMnYOD51vusq9KvSA.png"
            alt="Tesla Model 3"
          />
          {/* Star Rating - Bottom Left */}
          <HStack
            position="absolute"
            bottom={2}
            left={2}
            bg="white"
            px={2}
            py={1}
            borderRadius="md"
            spacing={1}
            boxShadow="sm"
          >
            <Icon as={FaStar} color="yellow.400" boxSize={3} />
            <Text fontSize="sm" fontWeight="medium">
              4.8
            </Text>
          </HStack>
        </Box>

        {/* Content Section */}
        <Flex p={3} w="full" h="full" justify="space-between">
          <VStack align="flex-start" spacing={2} flex={1}>
            {/* Header with Tesla Logo */}
            <VStack align="flex-start" spacing={0}>
              <HStack spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="red.500"
                  letterSpacing="wider"
                >
                  TESLA
                </Text>
                <Text fontSize="md" fontWeight="bold">
                  Model 3
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                B Desai
              </Text>
            </VStack>

            {/* Specs */}
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="sm">Electric • 5 seats • Auto</Text>
              <Text fontSize="sm" color="gray.600">
                250mi range • Premium
              </Text>
            </VStack>
          </VStack>

          {/* Price & CTA */}
          <VStack align="flex-end" justify="space-between">
            <VStack align="flex-end" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                $89
              </Text>
              <Text fontSize="xs" color="gray.500">
                per day
              </Text>
            </VStack>
            <Button
              colorScheme="blue"
              size="sm"
              px={4}
              borderRadius="md"
              fontWeight="bold"
              variant="solid"
            >
              RENT
            </Button>
          </VStack>
        </Flex>
      </Card>
    </Box>
  );
}
