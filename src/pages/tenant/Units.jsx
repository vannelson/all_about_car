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
  const [topbar, setTopbar] = useState({ gear: "", fuel: "", brand: "", availability: "", search: "" });
  const [filters, setFilters] = useState({});

  return (
    <>
      {/* Sticky Blue Filters Top Bar */}
      <FiltersTopBar
        value={topbar}
        onChange={(v)=>{
          setTopbar(v);
          // map to API filters: brand->info_make, transmission->spcs_transmission, plate/model via search
          const mapped = {
            brand: v.brand,
            transmission: v.gear,
            fuel: v.fuel, // backend to support later; still pass as param
            availability: v.availability,
            plateNumber: v.search,
            model: v.search,
          };
          setFilters(mapped);
        }}
        onReset={()=>{ setTopbar({ gear:"", fuel:"", brand:"", search:"" }); setFilters({}); }}
        showRegister
        onRegister={onRegOpen}
      />

      <Box p={4}>
        <CarListTableOrCard query={topbar.search} onQueryChange={(q)=> setTopbar((p)=> ({...p, search:q}))} filters={filters} />
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
