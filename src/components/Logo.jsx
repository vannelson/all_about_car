import { Flex, Text, Image, useColorModeValue } from "@chakra-ui/react";

export default function Logo({ height = 44, title = "TravelCars", src = null }) {
  const containerH = `${height}px`;
  const color = useColorModeValue("blue.700", "blue.200");

  return (
    <Flex align="center" h={containerH} aria-label={`${title} home`} title={title}>
      {src ? (
        <Image src={src} alt={title} height={`${Math.round(height * 0.8)}px`} objectFit="contain" />
      ) : (
        <Text
          fontFamily="heading"
          fontWeight="extrabold"
          fontSize={height >= 54 ? "2xl" : height >= 44 ? "xl" : "lg"}
          lineHeight={1}
          letterSpacing="-0.01em"
          color={color}
        >
          {title}
        </Text>
      )}
    </Flex>
  );
}
