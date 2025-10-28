import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiFilter,
  FiHome,
  FiLayers,
  FiSliders,
  FiTag,
  FiDroplet,
} from "react-icons/fi";
import { TbSteeringWheel } from "react-icons/tb";
import { RiFlashlightLine } from "react-icons/ri";

const defaultFilters = {
  gearType: "all",
  fuelType: "all",
  brand: "all",
  vehicleClass: "all",
  company: "all",
};

const defaultOptions = {
  gearTypes: [],
  fuelTypes: [],
  brands: [],
  vehicleClasses: [],
  companies: [],
};

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest vehicles" },
];

const menuConfig = {
  gearType: { label: "Gear Type", icon: TbSteeringWheel },
  fuelType: { label: "Fuel Type", icon: FiDroplet },
  brand: { label: "Brands", icon: FiTag },
  vehicleClass: { label: "Vehicle Class", icon: FiLayers },
  company: { label: "Rental Companies", icon: FiHome },
};

export default function FilterToolbar({
  filters = defaultFilters,
  options = defaultOptions,
  onFilterChange,
  onClear,
  sortBy = "recommended",
  onSortChange,
  availableOnly = false,
  onToggleAvailable,
  resultCount = 0,
}) {
  const mergedFilters = { ...defaultFilters, ...(filters || {}) };
  const mergedOptions = { ...defaultOptions, ...(options || {}) };

  const handleSelect = (key, value) => () => {
    onFilterChange?.({ [key]: value });
  };

  const renderMenu = (key, fallbackLabel, items) => {
    const config = menuConfig[key] || { label: fallbackLabel };
    const icon = config.icon;
    const resolvedLabel = config.label || fallbackLabel;
    const current =
      mergedFilters[key] !== "all" ? mergedFilters[key] : resolvedLabel;

    return (
      <Menu placement="bottom-start" isLazy>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          variant="outline"
          size="sm"
          borderRadius="full"
          fontWeight="semibold"
          bg="white"
          px={4}
          py={2}
          borderColor="gray.200"
          _hover={{ bg: "gray.50" }}
          _active={{ bg: "gray.100" }}
        >
          <HStack spacing={2}>
            {icon && <Icon as={icon} boxSize={3.5} color="gray.500" />}
            <Text>{current}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleSelect(key, "all")}>
            All {resolvedLabel}
          </MenuItem>
          {items.map((item) => (
            <MenuItem key={item} onClick={handleSelect(key, item)}>
              {item}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  };

  const renderCompanyMenu = () => (
    <Menu placement="bottom-start" isLazy>
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        variant="outline"
        size="sm"
        borderRadius="full"
        fontWeight="semibold"
        bg="white"
        px={4}
        py={2}
        borderColor="gray.200"
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
      >
        <HStack spacing={2}>
          <Icon as={menuConfig.company.icon} boxSize={3.5} color="gray.500" />
          <Text>
            {mergedFilters.company !== "all"
              ? mergedOptions.companies.find((c) => String(c.id) === String(mergedFilters.company))
                  ?.name || "Selected company"
              : menuConfig.company.label}
          </Text>
        </HStack>
      </MenuButton>
      <MenuList maxH="260px" overflowY="auto">
        <MenuItem onClick={handleSelect("company", "all")}>All companies</MenuItem>
        {mergedOptions.companies.map((company) => (
          <MenuItem
            key={company.id ?? company.name}
            onClick={handleSelect("company", company.id ?? company.name)}
          >
            {company.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      p={{ base: 4, md: 6 }}
      bg="white"
      shadow="xl"
      borderColor="rgba(148, 163, 184, 0.2)"
    >
      <Flex
        direction={{ base: "column", xl: "row" }}
        align={{ base: "stretch", xl: "center" }}
        justify="space-between"
        gap={{ base: 5, xl: 6 }}
        flexWrap="wrap"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 3, md: 4 }}
          align={{ base: "flex-start", md: "center" }}
        >
          <HStack spacing={3} align="center">
            <Icon as={FiFilter} color="blue.500" boxSize={5} />
            <Text fontWeight="semibold" fontSize="md">
              {resultCount === 1
                ? "1 vehicle found"
                : `${resultCount} vehicles found`}
            </Text>
          </HStack>
          <HStack
            spacing={3}
            bg="blue.50"
            borderRadius="full"
            px={4}
            py={1.5}
            align="center"
            boxShadow="inset 0 0 0 1px rgba(59,130,246,0.12)"
          >
            <Icon as={RiFlashlightLine} color="blue.500" boxSize={4} />
            <Text fontSize="sm" color="blue.600" fontWeight="semibold">
              Available now
            </Text>
            <Switch
              colorScheme="blue"
              size="sm"
              isChecked={availableOnly}
              onChange={(event) => onToggleAvailable?.(event.target.checked)}
            />
          </HStack>
        </Stack>

        <Stack
          direction={{ base: "column", xl: "row" }}
          align={{ base: "stretch", xl: "center" }}
          spacing={3}
        >
          <Wrap spacing={3} align="center">
            <WrapItem>{renderMenu("gearType", "Gear Type", mergedOptions.gearTypes)}</WrapItem>
            <WrapItem>{renderMenu("fuelType", "Fuel Type", mergedOptions.fuelTypes)}</WrapItem>
            <WrapItem>{renderMenu("brand", "Brands", mergedOptions.brands)}</WrapItem>
            <WrapItem>
              {renderMenu(
                "vehicleClass",
                "Vehicle Class",
                mergedOptions.vehicleClasses
              )}
            </WrapItem>
            <WrapItem>{renderCompanyMenu()}</WrapItem>
          </Wrap>

          <HStack spacing={2} justify={{ base: "flex-start", xl: "flex-end" }}>
            <Menu placement="bottom-end" isLazy>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="outline"
                size="sm"
                borderRadius="full"
                fontWeight="semibold"
                bg="white"
                _hover={{ bg: "gray.50" }}
              >
                <HStack spacing={2}>
                  <Icon as={FiSliders} />
                  <Text>
                    Sort by:{" "}
                    {
                      sortOptions.find((option) => option.value === sortBy)?.label ??
                      "Recommended"
                    }
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                {sortOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => onSortChange?.(option.value)}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Button
              variant="ghost"
              colorScheme="blue"
              size="sm"
              borderRadius="full"
              onClick={() => onClear?.()}
            >
              Clear filters
            </Button>
          </HStack>
        </Stack>
      </Flex>
    </Box>
  );
}
