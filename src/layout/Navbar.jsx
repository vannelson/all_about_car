import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Icon,
  IconButton,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  BellIcon,
  CloseIcon,
  HamburgerIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logo from "../components/Logo";

const Navbar = ({
  navItems = [],
  onOpenDrawer,
  isAuthenticated,
  user,
  onLogout,
  role,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const isBorrower = role === "borrower";

  const baseBg = useColorModeValue("white", "gray.800");
  const baseColor = useColorModeValue("gray.600", "white");
  const baseBorder = useColorModeValue("gray.200", "gray.900");

  const bg = isBorrower ? "rgba(255,255,255,0.97)" : baseBg;
  const color = isBorrower ? "gray.700" : baseColor;
  const borderColor = isBorrower ? "transparent" : baseBorder;
  const boxShadow = isBorrower ? "0 6px 18px rgba(37, 99, 235, 0.08)" : "none";

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={20}
      bg={bg}
      boxShadow={boxShadow}
      borderBottomWidth={isBorrower ? 0 : 1}
      borderBottomColor={borderColor}
      backdropFilter={isBorrower ? "blur(10px)" : undefined}
    >
      <Flex
        color={color}
        minH={isBorrower ? "78px" : "60px"}
        py={{ base: 2, md: isBorrower ? 3 : 2 }}
        px={{ base: 4, md: isBorrower ? 8 : 0 }}
        align="center"
        borderRadius={0}
        transition="background 0.2s ease"
      >
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
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>

        <Flex flex={{ base: 1 }} align="center" gap={{ base: 6, md: 10 }}>
          <RouterLink to="/">
            <Logo height={isBorrower ? 46 : 44} src="/logo.png" />
          </RouterLink>

          <Flex display={{ base: "none", md: "flex" }} ml={0}>
            <DesktopNav
              navItems={navItems}
              variant={isBorrower ? "minimal" : "underline"}
            />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={2}
          align="center"
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
                borderRadius={isBorrower ? "full" : "md"}
                onClick={() =>
                  onOpenDrawer(
                    "Account Settings",
                    "md",
                    "right",
                    "account-settings"
                  )
                }
              />
              <Button
                variant={isBorrower ? "solid" : "outline"}
                bgGradient={
                  isBorrower ? "linear(to-r, #2563EB, #38BDF8)" : undefined
                }
                color={isBorrower ? "white" : undefined}
                borderRadius={isBorrower ? "full" : "md"}
                px={isBorrower ? 6 : undefined}
                boxShadow={
                  isBorrower ? "0 10px 25px rgba(37, 99, 235, 0.25)" : undefined
                }
                _hover={
                  isBorrower
                    ? {
                        bgGradient: "linear(to-r, #1D4ED8, #2563EB)",
                        transform: "translateY(-1px)",
                      }
                    : undefined
                }
                onClick={onLogout}
                leftIcon={<FiLogOut />}
              >
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

      <Collapse in={isOpen} animateOpacity>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <MobileNav
            navItems={navItems}
            onOpenDrawer={onOpenDrawer}
            variant={isBorrower ? "minimal" : "underline"}
          />
        </Container>
      </Collapse>
    </Box>
  );
};

export default Navbar;
