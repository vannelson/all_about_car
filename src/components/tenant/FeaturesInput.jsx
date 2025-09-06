import React, { useState } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  FormLabel,
  VStack,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import FeaturesList from "./FeaturesList";

const FeaturesInput = ({
  label = "Features & Amenities",
  value = [],
  onChange,
  popularFeatures = [
    "Bluetooth",
    "Navigation",
    "Sunroof",
    "Heated Seats",
    "Backup Camera",
    "Apple CarPlay",
    "Android Auto",
    "Leather Seats",
    "Alloy Wheels",
  ],
  ...props
}) => {
  const [newFeature, setNewFeature] = useState("");

  const addFeature = (feature) => {
    const trimmedFeature = feature.trim();
    if (trimmedFeature && !value.includes(trimmedFeature)) {
      onChange([...value, trimmedFeature]);
    }
  };

  const removeFeature = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleAddNew = () => {
    addFeature(newFeature);
    setNewFeature("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNew();
    }
  };

  return (
    <VStack spacing={6} align="stretch" {...props}>
      <Heading as="h2" size="md" color="blue.700">
        {label}{" "}
      </Heading>

      <Box>
        <FormLabel>Current Features</FormLabel>
        <FeaturesList features={value} onRemoveFeature={removeFeature} mb={4} />
      </Box>

      <Box>
        <FormLabel>Add New Feature</FormLabel>
        <InputGroup size="md">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter a feature"
            onKeyPress={handleKeyPress}
          />
          <InputRightElement width="4.5rem">
            <IconButton
              aria-label="Add feature"
              icon={<FaPlus />}
              onClick={handleAddNew}
              colorScheme="blue"
              size="sm"
              isDisabled={!newFeature.trim()}
            />
          </InputRightElement>
        </InputGroup>
      </Box>

      <Box mt={4}>
        <Text fontWeight="medium" mb={2}>
          Popular Features
        </Text>
        <FeaturesList
          features={popularFeatures}
          tagProps={{
            variant: "outline",
            colorScheme: "blue",
            cursor: "pointer",
            onClick: (e) => {
              const feature = e.currentTarget.textContent;
              addFeature(feature);
            },
          }}
        />
      </Box>
    </VStack>
  );
};

export default FeaturesInput;
