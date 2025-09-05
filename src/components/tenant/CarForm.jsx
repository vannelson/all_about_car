import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Collapse,
  Icon,
  Divider,
  IconButton,
  Wrap,
  WrapItem,
  Badge,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepTitle,
  StepDescription,
  StepNumber,
  StepSeparator,
  useSteps,
  Image,
  Stack,
  CardFooter,
  GridItem,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Flex,
  Avatar,
  AvatarGroup,
  Center,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaArrowLeft,
  FaTrash,
  FaHistory,
} from "react-icons/fa";
import {
  FaCalendarAlt,
  FaUsers,
  FaSuitcase,
  FaCogs,
  FaGasPump,
  FaTachometerAlt,
  FaCheck,
  FaCloudUploadAlt,
  FaCar,
} from "react-icons/fa";
import ImageUpload from "./ImageUpload";
import FeaturesInput from "./FeaturesInput";

const steps = [
  { title: "Basic", description: "Vehicle Info" },
  { title: "Specs", description: "Specifications" },
  { title: "Features", description: "Add Features" },
  { title: "Pictures", description: "Upload Images" },
  { title: "Review", description: "Preview & Submit" },
];

const CarForm = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const toast = useToast();
  const [features, setFeatures] = useState([
    "Keyless Entry",
    "5 Star ANCAP Rating",
    '8" Touchscreen Entertainment',
  ]);
  const [newFeature, setNewFeature] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    age: "0-3",
    carType: "SUV",
    seats: 5,
    largeBags: 1,
    smallBags: 2,
    engineSize: 1998,
    transmission: "Automatic",
    fuelType: "Petrol",
    fuelEfficiency: 7.6,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", {
      ...formData,
      features,
      profileImage,
      displayImages,
    });

    toast({
      title: "Car registered successfully",
      description: `${formData.make} ${formData.model} has been added to your rental fleet`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Reset form
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      age: "0-3",
      carType: "SUV",
      seats: 5,
      largeBags: 1,
      smallBags: 2,
      engineSize: 1998,
      transmission: "Automatic",
      fuelType: "Petrol",
      fuelEfficiency: 7.6,
    });
    setFeatures([
      "Keyless Entry",
      "5 Star ANCAP Rating",
      '8" Touchscreen Entertainment',
    ]);
    setProfileImage(null);
    setDisplayImages([]);
    setActiveStep(0);
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Popular car brands
  const carBrands = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Kia",
    "Volkswagen",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Subaru",
    "Mazda",
    "Lexus",
    "Jeep",
  ];

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="md" color="blue.700">
              Basic Information
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Brand</FormLabel>
                <Select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="Select brand"
                >
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Model</FormLabel>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Camry, Civic, F-150"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Year</FormLabel>
                <NumberInput
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(value) => handleNumberChange("year", value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Vehicle Age</FormLabel>
                <Select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                >
                  <option value="0-3">0-3 years</option>
                  <option value="4-6">4-6 years</option>
                  <option value="7-10">7-10 years</option>
                  <option value="10+">10+ years</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Car Type</FormLabel>
                <Select
                  name="carType"
                  value={formData.carType}
                  onChange={handleInputChange}
                >
                  <option value="SUV">SUV</option>
                  <option value="VAN">VAN</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="COUPE">Coupe</option>
                  <option value="CONVERTIBLE">Convertible</option>
                  <option value="TRUCK">Truck</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
      case 1:
        return (
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="md" color="blue.700">
              Specifications
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Seats</FormLabel>
                <NumberInput
                  min={2}
                  max={9}
                  value={formData.seats}
                  onChange={(value) => handleNumberChange("seats", value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Engine Size (cc)</FormLabel>
                <NumberInput
                  min={1000}
                  max={5000}
                  value={formData.engineSize}
                  onChange={(value) => handleNumberChange("engineSize", value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Large Bags</FormLabel>
                <NumberInput
                  min={0}
                  max={5}
                  value={formData.largeBags}
                  onChange={(value) => handleNumberChange("largeBags", value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Small Bags</FormLabel>
                <NumberInput
                  min={0}
                  max={5}
                  value={formData.smallBags}
                  onChange={(value) => handleNumberChange("smallBags", value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Transmission</FormLabel>
                <Select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fuel Type</FormLabel>
                <Select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fuel Efficiency (L/100km)</FormLabel>
                <NumberInput
                  min={0}
                  max={20}
                  step={0.1}
                  value={formData.fuelEfficiency}
                  onChange={(value) =>
                    handleNumberChange("fuelEfficiency", value)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </SimpleGrid>
          </VStack>
        );
      case 2:
        return (
          <VStack spacing={6} align="stretch">
            <FeaturesInput value={features} onChange={setFeatures} />
          </VStack>
        );
      case 3:
        return (
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="md" color="blue.700">
              Upload Car Pictures
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <ImageUpload
                multiple={false}
                onImagesChange={(images) => setProfileImage(images[0] || null)}
                initialImages={profileImage ? [profileImage] : []}
                mb={4}
              />
              <ImageUpload
                multiple={true}
                maxFiles={10}
                onImagesChange={setDisplayImages}
                initialImages={displayImages}
              />
            </SimpleGrid>
          </VStack>
        );
      case 4:
        return (
          <HStack align="start" spacing={5} width="100%">
            {/* Main Vehicle Card - Column 1 */}
            <Card
              variant="outline"
              borderRadius="xl"
              boxShadow="sm"
              borderColor="gray.100"
              width="100%"
            >
              <Image
                objectFit="cover"
                width="100%"
                height="200px"
                src={profileImage}
                alt={`${formData.make} ${formData.model}`}
              />

              <Stack spacing={4} p={5}>
                {/* Header */}
                <Box mb={4}>
                  <Heading size="md" fontWeight="bold" color="gray.800" mb={2}>
                    {formData.make} {formData.model}
                  </Heading>

                  <HStack spacing={2} flexWrap="wrap">
                    <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                      <HStack spacing={1}>
                        <Icon as={FaCar} boxSize={3} />
                        <Text fontSize="xs">{formData.carType}</Text>
                      </HStack>
                    </Badge>

                    <Badge colorScheme="gray" px={2} py={1} borderRadius="md">
                      <HStack spacing={1}>
                        <Icon as={FaCalendarAlt} boxSize={3} />
                        <Text fontSize="xs">{formData.year}</Text>
                      </HStack>
                    </Badge>

                    <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                      <HStack spacing={1}>
                        <Icon as={FaHistory} boxSize={3} />
                        <Text fontSize="xs">
                          {formData.age.includes("+")
                            ? `${formData.age.replace("+", "")}+ yrs`
                            : `${formData.age} yrs`}
                        </Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </Box>

                {/* Specifications Grid */}
                <SimpleGrid columns={2} spacing={4}>
                  {[
                    { icon: FaUsers, label: "Seats", value: formData.seats },
                    {
                      icon: FaCogs,
                      label: "Engine",
                      value: `${formData.engineSize}cc`,
                    },
                    {
                      icon: FaGasPump,
                      label: "Fuel",
                      value: formData.fuelType,
                    },
                    {
                      icon: FaTachometerAlt,
                      label: "Economy",
                      value: `${formData.fuelEfficiency}L/100km`,
                    },
                    {
                      icon: FaCogs,
                      label: "Trans",
                      value: formData.transmission,
                    },
                    {
                      icon: FaSuitcase,
                      label: "Luggage",
                      value: `${formData.largeBags}L ${formData.smallBags}S`,
                    },
                  ].map((item, index) => (
                    <HStack key={index} spacing={3} align="flex-start">
                      <Center w={8} h={8} borderRadius="md" bg="blue.50">
                        <Icon as={item.icon} color="blue.600" boxSize={3} />
                      </Center>
                      <Box>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          {item.label}
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {item.value}
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card>

            {/* Features Card - Column 2 */}
            <Card
              variant="outline"
              borderRadius="xl"
              boxShadow="sm"
              borderColor="gray.100"
              width="100%"
            >
              <Stack spacing={4} p={5}>
                <Heading size="md" fontWeight="semibold" color="gray.800">
                  Features
                </Heading>

                <Wrap spacing={2}>
                  {features.slice(0, 8).map((feature, index) => (
                    <WrapItem key={index}>
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        colorScheme="blue"
                        variant="subtle"
                        fontSize="xs"
                      >
                        <HStack spacing={1}>
                          <Icon as={FaCheck} boxSize={2} />
                          <Text>{feature}</Text>
                        </HStack>
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>

                {features.length > 8 && (
                  <Box>
                    <Collapse in={showAllFeatures}>
                      <Wrap spacing={2} mt={2}>
                        {features.slice(8).map((feature, index) => (
                          <WrapItem key={index + 8}>
                            <Badge
                              px={2}
                              py={1}
                              borderRadius="md"
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="xs"
                            >
                              <HStack spacing={1}>
                                <Icon as={FaCheck} boxSize={2} />
                                <Text>{feature}</Text>
                              </HStack>
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Collapse>
                    <Button
                      variant="ghost"
                      size="xs"
                      colorScheme="blue"
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      mt={2}
                    >
                      {showAllFeatures
                        ? "Show Less"
                        : `Show ${features.length - 8} More`}
                    </Button>
                  </Box>
                )}
              </Stack>
            </Card>

            {/* Gallery Card - Column 3 */}
            <Card
              variant="outline"
              borderRadius="xl"
              boxShadow="sm"
              borderColor="gray.100"
              width="100%"
            >
              <Stack spacing={4} p={5}>
                <Heading size="md" fontWeight="semibold" color="gray.800">
                  Gallery
                </Heading>

                <Text fontSize="sm" color="gray.600">
                  {displayImages.length} photos available
                </Text>

                <SimpleGrid columns={2} spacing={3}>
                  {displayImages.slice(0, 4).map((image, index) => (
                    <Box
                      key={index}
                      borderRadius="md"
                      overflow="hidden"
                      height="80px"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Image
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                      />
                    </Box>
                  ))}
                </SimpleGrid>

                {displayImages.length > 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    colorScheme="blue"
                    rightIcon={<FaArrowRight />}
                  >
                    View All Photos
                  </Button>
                )}
              </Stack>
            </Card>
          </HStack>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {/* Stepper */}
          <Stepper index={activeStep} colorScheme="blue">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <HStack justify="space-between" pt={4}>
            <Button
              onClick={prevStep}
              isDisabled={activeStep === 0}
              leftIcon={<FaArrowLeft />}
              variant="outline"
            >
              Previous
            </Button>

            {activeStep < steps.length ? (
              <Button
                onClick={nextStep}
                rightIcon={<FaArrowRight />}
                colorScheme="blue"
              >
                Next
              </Button>
            ) : (
              <Button type="submit" colorScheme="green" rightIcon={<FaCheck />}>
                Submit
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default CarForm;
