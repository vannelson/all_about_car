import { HStack, Button, Box } from "@chakra-ui/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

export default function SocialButtonsLabeled() {
  return (
    <HStack spacing={4} w="100%">
      <Button
        flex="1"
        height="48px"
        borderRadius="lg"
        fontWeight="500"
        transition="all 0.3s"
        bg="white"
        color="gray.700"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ transform: "translateY(-2px)", shadow: "lg", borderColor: "red.300" }}
        _active={{ transform: "translateY(0)" }}
        leftIcon={<Box color="red.500"><FaGoogle /></Box>}
      >
        Google
      </Button>

      <Button
        flex="1"
        height="48px"
        borderRadius="lg"
        fontWeight="500"
        transition="all 0.3s"
        bg="#1877F2"
        color="white"
        _hover={{ transform: "translateY(-2px)", shadow: "lg", bg: "#166FE5" }}
        _active={{ transform: "translateY(0)" }}
        leftIcon={<FaFacebookF />}
      >
        Facebook
      </Button>
    </HStack>
  );
}

