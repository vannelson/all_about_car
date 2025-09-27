import { Button } from "@chakra-ui/react";

const BaseButton = ({
  children,
  variant = "solid",
  colorScheme = "teal",
  isDisabled = false,
  onClick,
  ...rest
}) => {
  return (
    <Button
      colorScheme={colorScheme}
      variant={variant}
      isDisabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
