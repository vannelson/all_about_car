import { Button } from "@chakra-ui/react";

const BaseButton = ({
  children,
  variant = "solid",
  colorScheme = "teal",
  isDisabled = false,
}) => {
  return (
    <Button colorScheme={colorScheme} variant={variant} isDisabled={isDisabled}>
      {children}
    </Button>
  );
};

export default BaseButton;
