import { useState } from "react";
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
  Spinner,
  Input,
} from "@chakra-ui/react";

import { SearchIcon, AddIcon } from "@chakra-ui/icons";

import { BsTable } from "react-icons/bs";
import { MdViewModule } from "react-icons/md";

import BaseButton from "../../components/base/BaseButton";
import Filters from "../../layout/tenant/Filters";
import TableCar from "../../components/tenant/tableview/TableCar";
import CardCar from "../../components/tenant/cardview/CardCar";

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
          {/* Replace with card or table view */}
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
  const [loading, setLoading] = useState(false);

  const handleToggleView = () => {
    setLoading(true);
    setTimeout(() => {
      setIsCardView((prev) => !prev);
      setLoading(false);
    }, 300); // 1 second delay
  };

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
              <Input maxW="350px" placeholder="Search cars..." />
            </InputGroup>
          </HStack>

          {/* Right side - Add & Toggle buttons */}
          <HStack spacing={2} align="center">
            <BaseButton colorScheme="green">
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
      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="grey.800" thickness="4px" />
        </Flex>
      ) : isCardView ? (
        <CardCar />
      ) : (
        <TableCar />
      )}
    </Box>
  );
}

export default Rentals;
