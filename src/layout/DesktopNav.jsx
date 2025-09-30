import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Stack, useColorModeValue } from "@chakra-ui/react";

export default function DesktopNav({ navItems }) {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");

  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label} mt={3}>
          <Link
            as={RouterLink}
            p={2}
            to={navItem.href}
            fontSize={"sm"}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: "none",
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
}
