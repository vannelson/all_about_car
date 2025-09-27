// Shared style props for auth pages without altering visuals
import { useColorModeValue } from "@chakra-ui/react";

export const primaryButtonProps = {
  size: "lg",
  height: "48px",
  borderRadius: "lg",
  fontWeight: "600",
  fontSize: "md",
  bgGradient: "linear-gradient(135deg, #3182CE 0%, #2B6CB0 100%)",
  color: "white",
  transition: "all 0.3s",
  _hover: {
    transform: "translateY(-2px)",
    boxShadow: "xl",
    bgGradient: "linear-gradient(135deg, #2B6CB0 0%, #2C5282 100%)",
  },
  _active: {
    transform: "translateY(0)",
  },
};

export function useAuthCardStyles() {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return {
    bg: cardBg,
    p: 8,
    rounded: "2xl",
    shadow: "2xl",
    borderWidth: "1px",
    borderColor,
    position: "relative",
    backdropFilter: "blur(10px)",
  };
}
