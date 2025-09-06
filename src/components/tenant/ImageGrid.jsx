import React from "react";
import { Box, Text, SimpleGrid, Button, Image } from "@chakra-ui/react";
import {} from "react-icons/fa";

const ImageGrid = ({
  images,
  columns = 2,
  spacing = 3,
  imageHeight = "80px",
  maxImages = 4,
  showCount = true,
  onViewAll,
}) => {
  const displayImages = images.slice(0, maxImages);

  return (
    <Box>
      {showCount && (
        <Text fontSize="sm" color="gray.600" mb={3}>
          {images.length} photos available
        </Text>
      )}

      <SimpleGrid columns={columns} spacing={spacing}>
        {displayImages.map((image, index) => (
          <Box
            key={index}
            borderRadius="md"
            overflow="hidden"
            height={imageHeight}
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

      {images.length > maxImages && onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          colorScheme="blue"
          rightIcon={<FaArrowRight />}
          mt={3}
          onClick={onViewAll}
        >
          View All Photos
        </Button>
      )}
    </Box>
  );
};

export default ImageGrid;
