import { Link as RouterLink } from "react-router-dom";
import { Stack, Flex, Text, useColorModeValue } from "@chakra-ui/react";

export default function MobileNav({ navItems, onOpenDrawer, variant = "underline" }) {
  const isPill = variant === "pill";
  const useGradientButton = variant !== "underline";
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} variant={variant} />
      ))}

      <Flex
        as="button"
        py={2}
        px={useGradientButton ? 6 : 4}
        rounded={useGradientButton ? "full" : "md"}
        bg={useGradientButton ? undefined : "blue.400"}
        bgGradient={useGradientButton ? "linear(to-r, #2563EB, #38BDF8)" : undefined}
        color="white"
        fontWeight="bold"
        boxShadow={useGradientButton ? "0 10px 20px rgba(37, 99, 235, 0.2)" : undefined}
        onClick={() => onOpenDrawer("Account Settings", "md", "right", "account-settings")}
      >
        Open Drawer
      </Flex>
    </Stack>
  );
}

function MobileNavItem({ label, href, variant = "underline" }) {
  const isPill = variant === "pill";
  const isMinimal = variant === "minimal";
  const hoverBg = useColorModeValue("gray.100", "gray.900");
  return (
    <Flex
      as={RouterLink}
      to={href}
      py={2}
      px={isPill ? 4 : 4}
      rounded={isPill ? "full" : "md"}
      borderWidth={isPill ? "1px" : "0"}
      borderColor={isPill ? "gray.200" : "transparent"}
      bg={isPill ? "gray.50" : "transparent"}
      _hover={{
        bg: isPill ? "gray.100" : hoverBg,
      }}
    >
      <Text fontWeight={isMinimal ? 600 : 600} color={isMinimal ? "blue.600" : undefined}>
        {label}
      </Text>
    </Flex>
  );
}

