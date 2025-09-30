import {
  Card,
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Flex,
  Button,
  Icon,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiUsers, FiSettings } from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import CarBrandLogo from "../../tenant/CarBrandLogo";

export default function CarRentalCardBooking() {
  const cars = [
    {
      id: 37,
      brand: "Mitsubishi",
      model: "Xpander",
      owner: "Host • A. Santos",
      image:
        "http://127.0.0.1:8000/storage/cars/37/profileImage/SKIehhOBXId3k2uI25vl1X803VbMifEg1zdXYVdj.png",
      rating: 4.7,
      price: "5,000",
      specs: ["Auto", "7 seats", "Gasoline"],
      available: true,
    },
    {
      id: 35,
      brand: "Toyota",
      model: "Vios",
      owner: "Host • C. Lim",
      image:
        "http://127.0.0.1:8000/storage/cars/35/profileImage/SgHJkNM5KojaiXFxr1V9mHXgC1apesBWzmUZSyZ8.png",
      rating: 4.8,
      price: "3,500",
      specs: ["Auto", "5 seats", "Gasoline"],
      available: true,
    },
    {
      id: 34,
      brand: "Nissan",
      model: "Almera",
      owner: "Host • J. Cruz",
      image:
        "http://127.0.0.1:8000/storage/cars/34/profileImage/Ea5RFEvwa5stb0bxlJnVtqMec2kpRfFgpztJQiqH.png",
      rating: 4.6,
      price: "3,500",
      specs: ["Manual", "5 seats", "Gasoline"],
      available: false,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-4">
      {cars.map((car) => (
        <Card
          key={car.id}
          variant="unstyled"
          w="100%"
          h="170px"
          bg="#fcfcfc"
          boxShadow={"sm"}
          className="group overflow-hidden rounded-2xl border border-gray-200 shadow-md transition-all duration-300 hover:border-blue-300 hover:shadow-xl"
        >
          <Flex h="100%">
            {/* Image */}
            <Box pos="relative" w="190px" h="100%" className="shrink-0">
              <Image
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                w="100%"
                h="100%"
                objectFit="cover"
                className="transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              {car.available && (
                <Box pos="absolute" top="8px" left="8px">
                  <Badge
                    colorScheme="green"
                    variant="solid"
                    className="rounded-md shadow px-2 py-0.5 text-[11px]"
                  >
                    Available
                  </Badge>
                </Box>
              )}
              <HStack
                pos="absolute"
                bottom="8px"
                left="8px"
                spacing={1}
                bg="whiteAlpha.900"
                px={2}
                py={1}
                borderRadius="md"
                boxShadow="sm"
                className="backdrop-blur-sm"
              >
                <Icon as={FaStar} color="yellow.400" boxSize={3.5} mr={1} />
                <Text fontWeight="medium">{car.rating.toFixed(1)}</Text>
              </HStack>
            </Box>

            {/* Content */}
            <Flex flex="1" justify="space-between" p={4}>
              <VStack align="flex-start" spacing={2} flex="1" pr={3}>
                <Box>
                  <HStack spacing={2} align="center">
                    <CarBrandLogo brand={car.brand} size={20} mr={1} />
                    <HStack spacing={2} align="baseline">
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        className="tracking-wide text-gray-800"
                      >
                        {car.model}
                      </Text>
                    </HStack>
                  </HStack>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    noOfLines={1}
                    ml="7"
                    className="text-gray-500"
                  >
                    {car.brand}
                  </Text>
                </Box>

                <VStack align="start" spacing={1} mt={1} mb={1}>
                  {car.specs.map((s) => {
                    let SpecIcon = null;
                    const label = s.toLowerCase();
                    if (label.includes("seat")) SpecIcon = FiUsers;
                    else if (label.includes("auto") || label.includes("manual"))
                      SpecIcon = FiSettings;
                    else if (
                      label.includes("gas") ||
                      label.includes("fuel") ||
                      label.includes("petrol") ||
                      label.includes("diesel") ||
                      label.includes("electric")
                    )
                      SpecIcon = BsFuelPump;

                    return (
                      <Box
                        key={s}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        fontSize="sm"
                        color="gray.700"
                      >
                        {SpecIcon && (
                          <Icon
                            as={SpecIcon}
                            boxSize={4}
                            color="gray.600"
                            mr={2}
                          />
                        )}
                        {s}
                      </Box>
                    );
                  })}
                </VStack>
              </VStack>

              <VStack align="flex-end" justify="space-between" w="120px">
                <Box textAlign="right">
                  <Text fontSize="xl" fontWeight="bold" color="gray.600">
                    {car.price}
                  </Text>
                  <Text fontSize="10px" color="gray.500">
                    per day
                  </Text>
                </Box>
                <Button
                  size="sm"
                  colorScheme="blue"
                  className="px-3 py-1.5 text-xs font-semibold"
                >
                  Rent
                </Button>
              </VStack>
            </Flex>
          </Flex>
        </Card>
      ))}
    </div>
  );
}
