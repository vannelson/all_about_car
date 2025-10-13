import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link, Stack, useColorModeValue } from "@chakra-ui/react";

export default function DesktopNav({ navItems }) {
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

  return (
    <Stack direction={"row"} spacing={6}>
      {navItems.map((navItem) => {
        const active = isActive(navItem.href);

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
