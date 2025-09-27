import { HStack, Divider, Text } from "@chakra-ui/react";

export default function OrDivider({ text = "or continue with", color = "gray.600" }) {
  return (
    <HStack>
      <Divider />
      <Text fontSize="sm" color={color} whiteSpace="nowrap" px={2} fontWeight="500">
        {text}
      </Text>
      <Divider />
    </HStack>
  );
}

