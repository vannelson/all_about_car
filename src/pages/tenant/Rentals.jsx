import { useState, useCallback } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  InputLeftElement,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  IconButton,
  InputGroup,
  HStack,
  Flex,
  Input,
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
import { useCarsData } from "../../hooks/useCarsData";

function Rentals() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4}>
      {isMobile && (
        <Button colorScheme="blue" mb={4} onClick={onOpen}>
          Filter
        </Button>
      )}
      <Grid templateColumns={{ base: "1fr", md: "2fr 9fr" }} gap={4}>
        {!isMobile && (
          <GridItem>
            <Filters />
          </GridItem>
        )}
        <GridItem>
          <CarListTableOrCard />
        </GridItem>
      </Grid>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p="0">
              <Filters />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}

function CarListTableOrCard() {
  const [isCardView, setIsCardView] = useState(true);
  const [query, setQuery] = useState("");
  const { cars, listLoading, page, limit, hasNext, meta, fetchPage } = useCarsData();
  const handlePaginate = useCallback(
    (nextPage, nextLimit) => {
      fetchPage({ page: nextPage, limit: nextLimit });
    },
    [fetchPage]
  );

  const handleToggleView = () => {
    setIsCardView((prev) => !prev);
  };

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

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
                placeholder="Search cars..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </HStack>

          {/* Right side - Add & Toggle buttons */}
          <HStack spacing={2} align="center">
            <BaseButton colorScheme="green" onClick={handleModalOpen}>
              <AddIcon mr="2" /> Add
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
      {isCardView ? (
        <CardCar
          cars={cars}
          listLoading={listLoading}
          page={page}
          limit={limit}
          hasNext={hasNext}
          meta={meta}
          query={query}
          onPaginate={handlePaginate}
        />
      ) : (
        <TableCar
          cars={cars}
          listLoading={listLoading}
          page={page}
          limit={limit}
          hasNext={hasNext}
          meta={meta}
          query={query}
          onPaginate={handlePaginate}
        />
      )}

      {/* Modal */}
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

export default Rentals;
