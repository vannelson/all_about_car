import React, { useState, useCallback } from "react";
import {
  Box,
  Image,
  Icon,
  Text,
  Wrap,
  WrapItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaCloudUploadAlt, FaTrash, FaTimes } from "react-icons/fa";

const ImageUpload = ({
  multiple = false,
  maxFiles = 10,
  onImagesChange,
  onFilesSelected,
  initialImages = [],
  aspectRatio = 16 / 9,
  ...props
}) => {
  const [images, setImages] = useState(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleFiles = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        return true;
      });

      if (!multiple && validFiles.length > 0) {
        // Single upload - replace existing image
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = event.target.result;
          setImages([newImage]);
          onImagesChange && onImagesChange([newImage]);
          onFilesSelected && onFilesSelected([validFiles[0]]);
        };
        reader.readAsDataURL(validFiles[0]);
      } else if (multiple) {
        // Multiple uploads - add to existing images
        const newImages = [];
        const readers = [];

        validFiles.slice(0, maxFiles - images.length).forEach((file) => {
          const reader = new FileReader();
          readers.push(reader);

          reader.onload = (event) => {
            newImages.push(event.target.result);

            // When all files are processed
            if (newImages.length === readers.length) {
              const updatedImages = [...images, ...newImages];
              setImages(updatedImages);
              onImagesChange && onImagesChange(updatedImages);
              onFilesSelected && onFilesSelected(validFiles.slice(0, maxFiles - images.length));
            }
          };
          reader.readAsDataURL(file);
        });

        if (validFiles.length > maxFiles - images.length) {
          toast({
            title: "Too many files",
            description: `Maximum ${maxFiles} images allowed`,
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
    [multiple, maxFiles, images, onImagesChange, toast]
  );

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange && onImagesChange(updatedImages);
  };

  const clearAll = () => {
    setImages([]);
    onImagesChange && onImagesChange([]);
  };

  return (
    <Box {...props}>
      {/* Upload area */}
      <Box
        border="2px dashed"
        borderColor={isDragging ? "blue.400" : "gray.300"}
        borderRadius="md"
        p={6}
        textAlign="center"
        cursor="pointer"
        position="relative"
        _hover={{ borderColor: "blue.500" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        transition="all 0.2s"
        bg={isDragging ? "blue.50" : "transparent"}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <Icon as={FaCloudUploadAlt} boxSize={8} color="gray.400" mb={2} />
        <Text fontWeight="medium">
          {isDragging
            ? "Drop images here"
            : `Drag & drop ${
                multiple ? "images" : "an image"
              } or click to browse`}
        </Text>
        <Text fontSize="sm" color="gray.600" mt={1}>
          {multiple
            ? `Up to ${maxFiles} images (${images.length}/${maxFiles} used)`
            : "Single image upload"}
        </Text>
      </Box>

      {/* Preview area */}
      {images.length > 0 && (
        <Box mt={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Text fontWeight="medium">
              {multiple ? "Uploaded Images" : "Uploaded Image"} ({images.length}
              )
            </Text>
            {multiple && images.length > 0 && (
              <Text
                fontSize="sm"
                color="blue.500"
                cursor="pointer"
                onClick={clearAll}
                _hover={{ textDecoration: "underline" }}
              >
                Clear all
              </Text>
            )}
          </Box>

          <Wrap spacing={3}>
            {images.map((image, index) => (
              <WrapItem key={index} position="relative">
                <Box
                  borderRadius="md"
                  overflow="hidden"
                  width="100px"
                  height={`${100 / aspectRatio}px`}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Image
                    src={image}
                    alt={`Upload ${index + 1}`}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <IconButton
                  aria-label="Remove image"
                  icon={<FaTimes />}
                  size="xs"
                  colorScheme="red"
                  position="absolute"
                  top={-2}
                  right={-2}
                  onClick={() => removeImage(index)}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
