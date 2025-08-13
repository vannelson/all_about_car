import {
  Box,
  Flex,
  Text,
  IconButton,
  Icon,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  CloseIcon,
  BellIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

import { FaUser } from "react-icons/fa";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar({ navItems = [], onOpenDrawer }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        {/* Mobile Menu Button */}
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        {/* Logo / Brand */}
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={{ base: "center", md: "left" }}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            fontWeight="bold"
          >
            My App
          </Text>

          {/* Desktop Menu */}
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav navItems={navItems} />
          </Flex>
        </Flex>

        {/* Call-to-action buttons */}
        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={2}
        >
          <Button as="a" fontSize="sm" fontWeight={400} variant="link" href="#">
            <SettingsIcon
              onClick={() => onOpenDrawer("Settings", "sm", "right")}
              boxSize={5}
            />
          </Button>
          <Button
            onClick={() => onOpenDrawer("Notification", "sm", "right")}
            as="a"
            fontSize="sm"
            fontWeight={400}
            variant="link"
            href="#"
          >
            <BellIcon boxSize={6} />
          </Button>
          <Button
            as="a"
            display={{ base: "none", md: "inline-flex" }}
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="blue.400"
            p="3"
            href="#"
            _hover={{ bg: "blue.300" }}
            onClick={() => onOpenDrawer("Account Settings", "lg", "right")}
          >
            <Icon as={FaUser} />
          </Button>
        </Stack>
      </Flex>

      {/* Mobile Menu Collapse */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} onOpenDrawer={onOpenDrawer} />
      </Collapse>
    </Box>
  );
}
