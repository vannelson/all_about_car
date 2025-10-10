import { Link as RouterLink } from "react-router-dom";
import { Stack, Flex, Text, Link, useColorModeValue } from "@chakra-ui/react";

export default function MobileNav({ navItems, onOpenDrawer }) {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}

      <Flex
        as="button"
        py={2}
        px={4}
        rounded="md"
        bg="blue.400"
        color="white"
        fontWeight="bold"
        onClick={() => onOpenDrawer("Account Settings", "md", "right", "account-settings")}
      >
        Open Drawer
      </Flex>
    </Stack>
  );
}

function MobileNavItem({ label, href }) {
  return (
    <Flex
      as={RouterLink}
      to={href}
      py={2}
      px={4}
      rounded="md"
      _hover={{ bg: useColorModeValue("gray.100", "gray.900") }}
    >
      <Text fontWeight={600}>{label}</Text>
    </Flex>
  );
}

