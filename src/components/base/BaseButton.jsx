import { Button } from "@chakra-ui/react";

const BaseButton = ({
  children,
  variant = "solid",
  colorScheme = "teal",
  isDisabled = false,
  onClick,
  ...resk
}) => {
  return (
    <Button
      colorScheme={colorScheme}
      variant={variant}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
