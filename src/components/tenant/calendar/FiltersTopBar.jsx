import {
  HStack,
  Select,
  Wrap,
  WrapItem,
  Button,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { FiFilter, FiX } from "react-icons/fi";

const FilterSm = chakra(FiFilter, {
  baseStyle: { w: "14px", h: "14px" },
});

export default function FiltersTopBar() {
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

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
      bg="white"
      borderBottom="1px solid"
      borderColor={borderCol}
    >
      {/* Filters */}
      <Wrap align="center" spacing={3}>
        <WrapItem>
          <Select
            placeholder="Gear Type"
            variant="outline"
            borderRadius="lg"
            minW="150px"
            borderColor={inputBorder}
            icon={<MdArrowDropDown />}
            boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </Select>
        </WrapItem>

        <WrapItem>
          <Select
            placeholder="Fuel Type"
            variant="outline"
            borderRadius="lg"
            minW="150px"
            icon={<MdArrowDropDown />}
            borderColor={inputBorder}
            boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </Select>
        </WrapItem>

        <WrapItem>
          <Select
            placeholder="Brand"
            variant="outline"
            borderRadius="lg"
            minW="200px"
            borderColor={inputBorder}
            icon={<MdArrowDropDown />}
            boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
          >
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
          </Select>
        </WrapItem>

        <WrapItem>
          <Select
            placeholder="Vehicle Class"
            variant="outline"
            borderRadius="lg"
            minW="200px"
            borderColor={inputBorder}
            icon={<MdArrowDropDown />}
            boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
          >
            <option value="economy">Economy</option>
            <option value="luxury">Luxury</option>
            <option value="suv">SUV</option>
          </Select>
        </WrapItem>

        <WrapItem>
          <Button
            leftIcon={<FiX size={14} />}
            variant="ghost"
            borderRadius="lg"
            border="none"
            size="md"
            color="gray.600"
            fontWeight="normal"
            _hover={{ bg: hoverBg }}
            boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px"
          >
            Clear All
          </Button>
        </WrapItem>
      </Wrap>

      {/* Sort */}
      <HStack spacing={2} align="center">
        <Select
          placeholder="Sort by"
          variant="outline"
          borderRadius="lg"
          minW="200px"
          size="md"
          icon={<FilterSm />}
          iconSize="0.9rem"
          borderColor={inputBorder}
          _hover={{ borderColor: "gray.400" }}
          _focusVisible={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
        >
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </Select>
      </HStack>
    </HStack>
  );
}
