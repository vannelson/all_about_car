import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  IconButton,
  InputGroup,
  InputLeftElement,
  HStack,
  Flex,
  Input,
  Heading,
} from "@chakra-ui/react";

import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { BsTable } from "react-icons/bs";
import { MdViewModule } from "react-icons/md";

import BaseButton from "../../components/base/BaseButton";
import Filters from "../../layout/tenant/Filters";
import FiltersTopBar from "../../components/tenant/calendar/FiltersTopBar";
import TableCar from "../../components/tenant/tableview/TableCar";
import CardCar from "../../components/tenant/cardview/CardCar";
import BaseModal from "../../components/base/BaseModal";
import CarRegistrationSteps from "../../components/tenant/CarRegistrationSteps";

function Units() {
  const {
    isOpen: isRegOpen,
    onOpen: onRegOpen,
    onClose: onRegClose,
  } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Search and filters state (controlled)
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    availability: "all",
    price: 7000,
    brand: "",
    carType: "",
    seats: "",
    transmission: "",
    plateNumber: "",
    vin: "",
  });

  return (
    <>
      {/* Sticky Blue Filters Top Bar */}
      <FiltersTopBar showRegister onRegister={onRegOpen} />

      <Box p={4}>
        <CarListTableOrCard
          query={query}
          onQueryChange={setQuery}
          filters={filters}
        />
      </Box>

      {/* Car Registration Modal */}
      <BaseModal
        title={"Car Registration"}
        isOpen={isRegOpen}
        onClose={onRegClose}
        size="6xl"
        hassFooter={false}
      >
        <CarRegistrationSteps />
      </BaseModal>
    </>
  );
}

function CarListTableOrCard({ query, onQueryChange, filters }) {
  return (
    <Box pt="3">
      {/* Card view */}
      <CardCar query={query} filters={filters} mode="manage" />
    </Box>
  );
}

export default Units;
