import { Flex, Text, Image, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Logo({
  height = 44,
  title = "TravelCars",
  src = "/logo.png",
}) {
  const containerH = `${height}px`;
  const color = useColorModeValue("blue.700", "blue.200");

  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [src]);
  const shouldShowImage = Boolean(src) && !imageFailed;

  return (
    <Flex
      align="center"
      h={containerH}
      aria-label={`${title} home`}
      title={title}
    >
      {shouldShowImage ? (
        <Image
          src={src}
          alt={title}
          height={`45px`}
          objectFit="contain"
          fallbackSrc=""
          onError={() => setImageFailed(true)}
        />
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
