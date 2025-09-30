import {
  Box,
  Flex,
  IconButton,
  Icon,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import {
  HamburgerIcon,
  CloseIcon,
  BellIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "../components/Logo";

export default function Navbar({
  navItems = [],
  onOpenDrawer,
  isAuthenticated,
  user,
  onLogout,
}) {
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
          <RouterLink to="/">
            <Logo height={44} />
          </RouterLink>
        
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
          {isAuthenticated ? (
            <>
              <Button
                as="a"
                fontSize="sm"
                fontWeight={400}
                variant="link"
                href="#"
              >
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
              <IconButton
                aria-label="Account settings"
                display={{ base: "none", md: "inline-flex" }}
                colorScheme="blue"
                icon={<Icon as={FaUser} />}
                onClick={() => onOpenDrawer("Account Settings", "lg", "right")}
              />
              <Button variant="outline" onClick={onLogout} leftIcon={<FiLogOut />}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost">
                Login
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="blue">
                Register
              </Button>
            </>
          )}
        </Stack>
      </Flex>

      {/* Mobile Menu Collapse */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} onOpenDrawer={onOpenDrawer} />
      </Collapse>
    </Box>
  );
}
