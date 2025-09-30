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
import {
  CAR_BRANDS,
  GEAR_TYPES,
  FUEL_TYPES,
  STATUS_OPTIONS,
} from "../../../utils/options";

const FilterSm = chakra(FiFilter, {
  baseStyle: { w: "14px", h: "14px" },
});

export default function FiltersTopBar({
  value = {},
  onChange,
  onReset,
  showRegister = false,
  onRegister,
}) {
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

  const SelectWithIcon = ({
    icon: LeftIcon,
    placeholder,
    minW = "170px",
    options = [],
    value,
    onChange,
  }) => (
    <HStack spacing={2}>
      <Icon as={LeftIcon} />
      <Select
        placeholder={placeholder}
        minW={minW}
        {...baseSelectProps}
        value={value || ""}
        onChange={onChange}
      >
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
            options={GEAR_TYPES}
            value={value.gear}
            onChange={(e) =>
              onChange && onChange({ ...value, gear: e.target.value })
            }
          />
        </WrapItem>

        <WrapItem>
          <SelectWithIcon
            icon={BsFuelPump}
            placeholder="Fuel Type"
            minW="170px"
            options={FUEL_TYPES}
            value={value.fuel}
            onChange={(e) =>
              onChange && onChange({ ...value, fuel: e.target.value })
            }
          />
        </WrapItem>

        <WrapItem>
          <SelectWithIcon
            icon={FaCar}
            placeholder="Brand"
            minW="200px"
            options={CAR_BRANDS}
            value={value.brand}
            onChange={(e) =>
              onChange && onChange({ ...value, brand: e.target.value })
            }
          />
        </WrapItem>

        <WrapItem>
          <HStack spacing={2}>
            <InputGroup minW="280px">
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
                value={value.search || ""}
                onChange={(e) =>
                  onChange && onChange({ ...value, search: e.target.value })
                }
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
              onClick={() => onReset && onReset()}
            />
          </Tooltip>
        </WrapItem>
      </Wrap>

      {/* Sort */}
      <HStack spacing={1} align="center">
        <Select
          placeholder="Status"
          variant="filled"
          borderRadius="lg"
          minW="140px"
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
          value={value.availability || ""}
          onChange={(e) =>
            onChange && onChange({ ...value, availability: e.target.value })
          }
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
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
