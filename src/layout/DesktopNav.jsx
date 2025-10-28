import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link, Stack, useColorModeValue } from "@chakra-ui/react";

export default function DesktopNav({ navItems, variant = "underline" }) {
  const location = useLocation();
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const activeColor = useColorModeValue("blue.500", "blue.300");

  const isActive = (href) => {
    if (!href) {
      return false;
    }

    if (href === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  const spacing = variant === "pill" ? 3 : variant === "minimal" ? 4 : 6;

  return (
    <Stack direction="row" spacing={spacing}>
      {navItems.map((navItem) => {
        const active = isActive(navItem.href);

        if (variant === "pill") {
          return (
            <Link
              key={navItem.label}
              as={RouterLink}
              to={navItem.href}
              fontSize="sm"
              fontWeight={active ? 700 : 500}
              px={4}
              py={2}
              borderRadius="full"
              bg={active ? "blue.50" : "transparent"}
              color={active ? "blue.600" : "gray.600"}
              borderWidth="1px"
              borderColor={active ? "rgba(59,130,246,0.3)" : "transparent"}
              transition="all 0.2s ease"
              _hover={{
                textDecoration: "none",
                bg: active ? "blue.100" : "gray.100",
                color: active ? "blue.700" : "gray.800",
              }}
            >
              {navItem.label}
            </Link>
          );
        }

        if (variant === "minimal") {
          return (
            <Link
              key={navItem.label}
              as={RouterLink}
              to={navItem.href}
              fontSize="sm"
              fontWeight={active ? 600 : 500}
              color={active ? "blue.600" : linkColor}
              px={3}
              py={2}
              borderBottomWidth="2px"
              borderBottomStyle="solid"
              borderBottomColor={active ? "blue.500" : "transparent"}
              transition="all 0.2s ease"
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                borderBottomColor: "blue.400",
              }}
            >
              {navItem.label}
            </Link>
          );
        }

        return (
          <Link
            key={navItem.label}
            as={RouterLink}
            to={navItem.href}
            fontSize={"sm"}
            fontWeight={active ? 600 : 500}
            borderBottomWidth="2px"
            borderBottomStyle="solid"
            borderBottomColor={active ? activeColor : "transparent"}
            display="inline-flex"
            alignItems="center"
            transition="all 0.2s ease"
            _hover={{
              textDecoration: "none",
              color: linkHoverColor,
              borderBottomColor: activeColor,
            }}
          >
            {navItem.label}
          </Link>
        );
      })}
    </Stack>
  );
}
