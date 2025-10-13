import { useEffect, useMemo, useState } from "react";
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
import { loadTopbarFilters, saveTopbarFilters } from "../../utils/helpers/filterPersistence";
import { useCarsData } from "../../hooks/useCarsData";

function Units() {
  const {
    isOpen: isRegOpen,
    onOpen: onRegOpen,
    onClose: onRegClose,
  } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Search and filters state (controlled)
  const [topbar, setTopbar] = useState(() => loadTopbarFilters());
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Map initial topbar -> filters on mount (and when loaded from storage)
    const v = topbar || {};
    const mapped = {
      brand: v.brand,
      transmission: v.gear,
      fuel: v.fuel,
      availability: v.availability,
      plateNumber: v.search,
      model: v.search,
      vin: v.search,
    };
    setFilters(mapped);
  }, []);

  return (
    <>
      {/* Sticky Blue Filters Top Bar */}
      <FiltersTopBar
        value={topbar}
        onChange={(v)=>{
          setTopbar(v);
          saveTopbarFilters(v);
          // map to API filters: brand->info_make, transmission->spcs_transmission, plate/model via search
          const mapped = {
            brand: v.brand,
            transmission: v.gear,
            fuel: v.fuel,
            availability: v.availability,
            plateNumber: v.search,
            model: v.search,
            vin: v.search,
          };
          setFilters(mapped);
        }}
        onReset={()=>{
          const cleared = { gear:"", fuel:"", brand:"", availability:"", search:"" };
          setTopbar(cleared);
          saveTopbarFilters(cleared);
          setFilters({});
        }}
        showRegister
        onRegister={onRegOpen}
      />

      <Box p={4}>
        <CarListTableOrCard query={topbar.search} filters={filters} />
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

function CarListTableOrCard({ query, filters }) {
  const { cars, listLoading, page, limit, hasNext, meta, fetchPage } = useCarsData({
    filters,
    limit: 10,
  });

  return (
    <Box pt="3">
      {/* Card view */}
      <CardCar
        cars={cars}
        listLoading={listLoading}
        page={page}
        limit={limit}
        hasNext={hasNext}
        meta={meta}
        query={query}
        filters={filters}
        mode="manage"
        onPaginate={(nextPage, nextLimit) =>
          fetchPage({ page: nextPage, limit: nextLimit })
        }
      />
    </Box>
  );
}

export default Units;
