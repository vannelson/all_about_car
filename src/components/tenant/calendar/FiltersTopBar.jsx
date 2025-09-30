import {
  Box,
  HStack,
  Select,
  Wrap,
  WrapItem,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
  chakra,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { FiFilter, FiRotateCcw, FiSettings, FiSearch } from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import { FaCar } from "react-icons/fa";

const FilterSm = chakra(FiFilter, {
  baseStyle: { w: "14px", h: "14px" },
});

export default function FiltersTopBar({ showRegister = false, onRegister }) {
  const borderCol = useColorModeValue("blue.700", "blue.800");
  const inputBorder = useColorModeValue("whiteAlpha.400", "whiteAlpha.500");
  const hoverBg = useColorModeValue("whiteAlpha.200", "whiteAlpha.300");

  const baseSelectProps = {
    variant: "filled",
    borderRadius: "lg",
    bg: "white",
    color: "gray.800",
    border: "1px solid",
    borderColor: inputBorder,
    icon: <MdArrowDropDown />,
    _hover: { bg: "white" },
    _focusVisible: {
      borderColor: "whiteAlpha.700",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.4)",
    },
  };

  const SelectWithIcon = ({ icon: LeftIcon, placeholder, minW = "170px", options = [] }) => (
    <HStack spacing={2}>
      <Icon as={LeftIcon} />
      <Select placeholder={placeholder} minW={minW} {...baseSelectProps}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </HStack>
  );

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
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="%23ffffff" stroke-width="1" opacity="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(%23p)"/></svg>\')',
          backgroundRepeat: "repeat",
        }}
      />
      {/* Filters */}
      <Wrap align="center" spacing={3}>
        <WrapItem>
          <SelectWithIcon
            icon={FiSettings}
            placeholder="Gear Type"
            minW="170px"
            options={[
              { value: "automatic", label: "Automatic" },
              { value: "manual", label: "Manual" },
            ]}
          />
        </WrapItem>

        <WrapItem>
          <SelectWithIcon
            icon={BsFuelPump}
            placeholder="Fuel Type"
            minW="170px"
            options={[
              { value: "petrol", label: "Petrol" },
              { value: "diesel", label: "Diesel" },
              { value: "electric", label: "Electric" },
            ]}
          />
        </WrapItem>

        <WrapItem>
          <SelectWithIcon
            icon={FaCar}
            placeholder="Brand"
            minW="200px"
            options={[
              { value: "toyota", label: "Toyota" },
              { value: "honda", label: "Honda" },
              { value: "bmw", label: "BMW" },
            ]}
          />
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
                _focusVisible={{
                  borderColor: "whiteAlpha.700",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.4)",
                }}
              />
            </InputGroup>
          </HStack>
        </WrapItem>

        <WrapItem>
          <Tooltip label="Reset filters">
            <IconButton
              aria-label="Reset filters"
              icon={<FiRotateCcw size={18} />}
              variant="outline"
              colorScheme="whiteAlpha"
              borderRadius="lg"
              size="md"
              color="white"
              _hover={{ bg: hoverBg }}
            />
          </Tooltip>
        </WrapItem>
      </Wrap>

      {/* Sort */}
      <HStack spacing={1} align="center">
        <Select
          placeholder="Sort by"
          variant="filled"
          borderRadius="lg"
          minW="120px"
          size="md"
          icon={<FilterSm />}
          iconSize="0.9rem"
          bg="white"
          color="gray.800"
          border="1px solid"
          borderColor={inputBorder}
          _hover={{ bg: "white" }}
          _focusVisible={{
            borderColor: "whiteAlpha.700",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.4)",
          }}
        >
          <option value="1">Available</option>
          <option value="2">Unavailalble</option>
          <option value="4">Popularity</option>
        </Select>
        {showRegister ? (
          <Button colorScheme="green" onClick={onRegister}>
            Add Unit
          </Button>
        ) : null}
      </HStack>
    </HStack>
  );
}
