import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
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
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Input,
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
import CarInfoTable from "./CarInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { createCar, updateCar, fetchCars } from "../../store/carsSlice";
import { selectAuth } from "../../store";

const steps = [
  { title: "Basic", description: "Vehicle Info" },
  { title: "Specs", description: "Specifications" },
  { title: "Features", description: "Add Features" },
  { title: "Pictures", description: "Upload " },
  { title: "Review", description: "Preview & Submit" },
];

const CarRegistrationSteps = ({
  mode = "create",
  initialData = null,
  carId = null,
  onSaved = () => {},
  onClose,
}) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const [submitting, setSubmitting] = useState(false);
  const [features, setFeatures] = useState([
    "Keyless Entry",
    "5 Star ANCAP Rating",
    '8" Touchscreen Entertainment',
  ]);
  const [profileImage, setProfileImage] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [displayImageFiles, setDisplayImageFiles] = useState([]);
  // Rates step removed; handled via separate modal elsewhere

  const [formData, setFormData] = useState({
    info_make: "",
    info_model: "",
    info_year: new Date().getFullYear(),
    info_age: "0-3",
    info_carType: "SUV",
    info_plateNumber: "",
    info_vin: "",
    info_availabilityStatus: "Available",
    info_location: "",
    info_mileage: 0,
    spcs_seats: 5,
    spcs_largeBags: 1,
    spcs_smallBags: 2,
    spcs_engineSize: 1998,
    spcs_transmission: "Automatic",
    spcs_fuelType: "Petrol",
    spcs_fuelEfficiency: 7.6,
  });

  const mapApiToForm = useMemo(
    () =>
      (api = {}) => ({
        info_make: api.info_make ?? "",
        info_model: api.info_model ?? "",
        info_year: api.info_year ?? new Date().getFullYear(),
        info_age: api.info_age ?? "0-3",
        info_carType: api.info_carType ?? "SUV",
        info_plateNumber: api.info_plateNumber ?? "",
        info_vin: api.info_vin ?? "",
        info_availabilityStatus:
          (api.info_availabilityStatus &&
            String(api.info_availabilityStatus).charAt(0).toUpperCase() +
              String(api.info_availabilityStatus).slice(1)) ||
          "Available",
        info_location: api.info_location ?? "",
        info_mileage: api.info_mileage ?? 0,
        spcs_seats: api.spcs_seats ?? 5,
        spcs_largeBags: api.spcs_largeBags ?? 1,
        spcs_smallBags: api.spcs_smallBags ?? 2,
        spcs_engineSize: api.spcs_engineSize ?? 1998,
        spcs_transmission: api.spcs_transmission ?? "Automatic",
        spcs_fuelType: api.spcs_fuelType ?? "Petrol",
        spcs_fuelEfficiency: api.spcs_fuelEfficiency ?? 7.6,
      }),
    []
  );

  // Prefill when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(mapApiToForm(initialData));
      const feat = Array.isArray(initialData.features)
        ? initialData.features
            .map((f) => (typeof f === "string" ? f : f?.name || ""))
            .filter(Boolean)
        : [];
      setFeatures(feat);
      const profile =
        initialData.profileImage || initialData.profile_image || null;
      const gallery = Array.isArray(initialData.displayImages)
        ? initialData.displayImages
        : Array.isArray(initialData.display_images)
        ? initialData.display_images
        : [];
      setProfileImage(profile);
      setDisplayImages(gallery);
    }
  }, [mode, initialData, mapApiToForm]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Require profile image only on create
      if (mode !== "edit" && !profileImage) {
        toast({
          title: "Profile image required",
          description: "Please upload a profile image.",
          status: "warning",
        });
        return;
      }
      setSubmitting(true);
      let action;
      if (mode === "edit" && carId) {
        action = await dispatch(
          updateCar({
            id: carId,
            formData,
            features,
            user: auth.user,
            profileImage: profileImage,
            displayImages: displayImages,
          })
        );
      } else {
        action = await dispatch(
          createCar({
            formData,
            features,
            user: auth.user,
            profileImage: profileImage,
            displayImages: displayImages,
          })
        );
      }

      const ok = (
        mode === "edit" ? updateCar.fulfilled : createCar.fulfilled
      ).match(action);
      if (ok) {
        toast({
          title: mode === "edit" ? "Car updated" : "Car saved",
          description:
            action.payload?.message ||
            (mode === "edit"
              ? "Car updated successfully"
              : "Car registered successfully"),
          status: "success",
        });
        // Refresh list and notify parent
        dispatch(fetchCars({}));
        onSaved(action.payload);
        if (onClose) onClose();
      } else {
        const err = action.payload || {};
        const errorsObj = err.errors || {};
        const flatErrors = Object.values(errorsObj).flat().join("\n");
        const msg =
          flatErrors ||
          err.message ||
          action.error?.message ||
          (mode === "edit" ? "Failed to update car" : "Failed to save car");
        toast({
          title: "Error",
          description: msg,
          status: "error",
          isClosable: true,
          duration: 6000,
        });
      }
    } finally {
      setSubmitting(false);
    }
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

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <CarInfo
            formData={formData}
            handleInputChange={handleInputChange}
            handleNumberChange={handleNumberChange}
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
                onFilesSelected={(files) =>
                  setProfileImageFile(files && files[0] ? files[0] : null)
                }
                initialImages={profileImage ? [profileImage] : []}
                mb={4}
              />
              <ImageUpload
                multiple={true}
                maxFiles={10}
                onImagesChange={setDisplayImages}
                onFilesSelected={(files) => setDisplayImageFiles(files || [])}
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
                <CarInfoTable formData={formData} />
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
                <Heading size="md" fontWeight="semibold" color="gray.800">
                  Specification
                </Heading>
                {/* Specifications Grid */}
                <CarSpecsGrid
                  formData={formData}
                  columns={{ base: 2, md: 2 }}
                  spacing={4}
                />
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
          {mode === "edit" ? (
            <Heading as="h2" size="md" color="blue.700">
              Edit Car
            </Heading>
          ) : (
            <Heading as="h2" size="md" color="blue.700">
              Car Registration
            </Heading>
          )}
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

            {activeStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                rightIcon={<FaArrowRight />}
                colorScheme="blue"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                colorScheme="green"
                rightIcon={<FaCheck />}
                isLoading={submitting}
                loadingText="Saving..."
              >
                {mode === "edit" ? "Save Changes" : "Submit"}
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default CarRegistrationSteps;
