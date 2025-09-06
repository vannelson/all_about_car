import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
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
  Icon,
  Wrap,
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
} from "@chakra-ui/react";
import { FaArrowRight, FaArrowLeft, FaHistory } from "react-icons/fa";
import { FaCalendarAlt, FaCheck, FaCar } from "react-icons/fa";

import ImageUpload from "./ImageUpload";
import FeaturesInput from "./FeaturesInput";
import FeaturesList from "./FeaturesList.JSX";
import BaseCard from "../base/BaseCard";
import ImageGrid from "./ImageGrid";
import CarSpecsGrid from "./CarSpecsGrid";
import CarInfo from "./form/CarInfo";
import CarSpecifications from "./form/CarSpecifications";

const steps = [
  { title: "Basic", description: "Vehicle Info" },
  { title: "Specs", description: "Specifications" },
  { title: "Features", description: "Add Features" },
  { title: "Pictures", description: "Upload Images" },
  { title: "Review", description: "Preview & Submit" },
];

const CarRegistrationSteps = () => {
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
    // New fields
    plateNumber: "",
    vin: "",
    availabilityStatus: "Available",
    location: "",
    mileage: 0,
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
          <CarInfo
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberChange={handleNumberChange}
            carBrands={carBrands}
          />
        );
      case 1:
        return (
          <CarSpecifications
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberChange={handleNumberChange}
          />
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
            <BaseCard>
              <Image
                objectFit="cover"
                width="100%"
                height="200px"
                src={profileImage}
                alt={`${formData.make} ${formData.model}`}
              />

              <Stack spacing="4" p="5">
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
                <CarSpecsGrid
                  formData={formData}
                  columns={{ base: 2, md: 2 }}
                  spacing={4}
                />
              </Stack>
            </BaseCard>

            {/* Features Card - Column 2 */}

            <BaseCard>
              <Stack spacing="4" p="5">
                <Heading size="md" fontWeight="semibold" color="gray.800">
                  Features
                </Heading>
                <Wrap spacing={2}>
                  <FeaturesList features={features} />
                </Wrap>
              </Stack>
            </BaseCard>

            <BaseCard>
              <Stack p="5">
                <Heading size="md" fontWeight="semibold" color="gray.800">
                  Gallery
                </Heading>
                <ImageGrid
                  images={displayImages}
                  onViewAll={() => console.log("View all photos clicked")}
                />
              </Stack>
            </BaseCard>

            {/* Gallery Card - Column 3 */}
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

export default CarRegistrationSteps;
