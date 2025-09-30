import { Box, HStack, Select, Wrap, WrapItem, Button, useColorModeValue, chakra, Icon, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { FiFilter, FiX, FiSettings, FiSearch } from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import { FaCar } from "react-icons/fa";

const FilterSm = chakra(FiFilter, {
  baseStyle: { w: "14px", h: "14px" },
});

export default function FiltersTopBar() {
  const borderCol = useColorModeValue("blue.700", "blue.800");
  const inputBorder = useColorModeValue("whiteAlpha.400", "whiteAlpha.500");
  const hoverBg = useColorModeValue("whiteAlpha.200", "whiteAlpha.300");

  return (
    <HStack
      p={4}
      align="center"
      justify="space-between"
      flexWrap="wrap"
      w="100%"
      position="sticky"
      top="0"
      zIndex="10"
      bgGradient="linear(to-r, blue.700, blue.600, blue.700)"
      color="white"
      borderBottom="1px solid"
      borderColor={borderCol}
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        opacity={0.08}
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\"><defs><pattern id=\"p\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><path d=\"M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30\" stroke=\"%23ffffff\" stroke-width=\"1\" opacity=\"0.6\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23p)\"/></svg>')",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Filters */}
      <Wrap align="center" spacing={3}>
        <WrapItem>
          <HStack spacing={2}>
            <Icon as={FiSettings} />
            <Select
              placeholder="Gear Type"
              variant="filled"
              borderRadius="lg"
              minW="170px"
              bg="white"
              color="gray.800"
              border="1px solid"
              borderColor={inputBorder}
              icon={<MdArrowDropDown />}
              _hover={{ bg: "white" }}
              _focusVisible={{ borderColor: "whiteAlpha.700", boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }}
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </Select>
          </HStack>
        </WrapItem>

        <WrapItem>
          <HStack spacing={2}>
            <Icon as={BsFuelPump} />
            <Select
              placeholder="Fuel Type"
              variant="filled"
              borderRadius="lg"
              minW="170px"
              icon={<MdArrowDropDown />}
              bg="white"
              color="gray.800"
              border="1px solid"
              borderColor={inputBorder}
              _hover={{ bg: "white" }}
              _focusVisible={{ borderColor: "whiteAlpha.700", boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }}
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </Select>
          </HStack>
        </WrapItem>

        <WrapItem>
          <HStack spacing={2}>
            <Icon as={FaCar} />
            <Select
              placeholder="Brand"
              variant="filled"
              borderRadius="lg"
              minW="200px"
              bg="white"
              color="gray.800"
              border="1px solid"
              borderColor={inputBorder}
              icon={<MdArrowDropDown />}
              _hover={{ bg: "white" }}
              _focusVisible={{ borderColor: "whiteAlpha.700", boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }}
            >
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="bmw">BMW</option>
            </Select>
          </HStack>
        </WrapItem>

        <WrapItem>
          <HStack spacing={2}>
            <InputGroup minW="240px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search vehicles..."
                bg="white"
                color="gray.800"
                borderRadius="lg"
                borderColor={inputBorder}
                _hover={{ bg: "white" }}
                _focusVisible={{ borderColor: "whiteAlpha.700", boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }}
              />
            </InputGroup>
          </HStack>
        </WrapItem>

        <WrapItem>
          <Button
            leftIcon={<FiX size={14} />}
            variant="outline"
            colorScheme="whiteAlpha"
            borderRadius="lg"
            size="md"
            color="white"
            fontWeight="semibold"
            _hover={{ bg: hoverBg }}
          >
            Clear All
          </Button>
        </WrapItem>
      </Wrap>

      {/* Sort */}
      <HStack spacing={2} align="center">
        <Icon as={FilterSm} />
        <Select
          placeholder="Sort by"
          variant="filled"
          borderRadius="lg"
          minW="200px"
          size="md"
          icon={<FilterSm />}
          iconSize="0.9rem"
          bg="white"
          color="gray.800"
          border="1px solid"
          borderColor={inputBorder}
          _hover={{ bg: "white" }}
          _focusVisible={{ borderColor: "whiteAlpha.700", boxShadow: "0 0 0 1px rgba(255,255,255,0.4)" }}
        >
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </Select>
      </HStack>
    </HStack>
  );
}
