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
  Spinner,
  Input,
  Heading,
} from "@chakra-ui/react";

import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { BsTable } from "react-icons/bs";
import { MdViewModule } from "react-icons/md";

import BaseButton from "../../components/base/BaseButton";
import Filters from "../../layout/tenant/Filters";
import TableCar from "../../components/tenant/tableview/TableCar";
import CardCar from "../../components/tenant/cardview/CardCar";
import BaseModal from "../../components/base/BaseModal";
import CarRegistrationSteps from "../../components/tenant/CarRegistrationSteps";

function Units() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Units</Heading>
        {isMobile && (
          <Button colorScheme="blue" onClick={onOpen}>
            Filter
          </Button>
        )}
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "2fr 9fr" }} gap={4}>
        {!isMobile && (
          <GridItem>
            <Filters value={filters} onChange={setFilters} />
          </GridItem>
        )}
        <GridItem>
          <CarListTableOrCard
            query={query}
            onQueryChange={setQuery}
            filters={filters}
          />
        </GridItem>
      </Grid>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p="0">
              <Filters value={filters} onChange={setFilters} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}

function CarListTableOrCard({ query, onQueryChange, filters }) {
  const [isCardView, setIsCardView] = useState(true);
  const [loading, setLoading] = useState(false);
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } =
    useDisclosure();

  const handleToggleView = () => {
    setLoading(true);
    setTimeout(() => {
      setIsCardView((prev) => !prev);
      setLoading(false);
    }, 300);
  };

  function handleModalOpen() {
    onModalOpen();
  }

  return (
    <Box pt="3">
      <Box pb={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={{ base: 3, md: 2 }}
        >
          {/* Left side - Search */}
          <HStack align="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <InputGroup maxW="350px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                maxW="350px"
                placeholder="Search units..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
            </InputGroup>
          </HStack>

          {/* Right side - Add & Toggle buttons */}
          <HStack spacing={2} align="center">
            <BaseButton colorScheme="green" onClick={handleModalOpen}>
              <AddIcon mr="2" /> Add Unit
            </BaseButton>
            <IconButton
              aria-label="Toggle view"
              icon={isCardView ? <MdViewModule /> : <BsTable />}
              onClick={handleToggleView}
              colorScheme="teal"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Table Or Grid */}
      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="grey.800" thickness="4px" />
        </Flex>
      ) : isCardView ? (
        <CardCar query={query} filters={filters} mode="manage" />
      ) : (
        <TableCar query={query} filters={filters} mode="manage" />
      )}

      {/* Add/Edit Modal */}
      <BaseModal
        title={"Car Registration"}
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="6xl"
        hassFooter={false}
      >
        <CarRegistrationSteps />
      </BaseModal>
    </Box>
  );
}

export default Units;
