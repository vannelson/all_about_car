import React from "react";
import {
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Text,
} from "@chakra-ui/react";

const FeaturesList = ({
  features = [],
  onRemoveFeature,
  tagProps = {},
  ...props
}) => {
  if (features.length === 0) {
    return (
      <Text color="gray.500" fontStyle="italic" {...props}>
        No features added yet
      </Text>
    );
  }

  return (
    <Wrap spacing={2} {...props}>
      {features.map((feature, index) => (
        <WrapItem key={index}>
          <Tag
            size="lg"
            borderRadius="full"
            variant="solid"
            colorScheme="blue"
            py={1}
            px={3}
            {...tagProps}
          >
            <TagLabel>{feature}</TagLabel>
            {onRemoveFeature && (
              <TagCloseButton onClick={() => onRemoveFeature(index)} />
            )}
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default FeaturesList;
