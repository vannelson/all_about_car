import { Card } from "@chakra-ui/react";

// BaseCard Component
const BaseCard = ({
  children,
  variant = "outline",
  borderRadius = "xl",
  boxShadow = "sm",
  borderColor = "gray.100",
  width = "100%",
  ...props
}) => {
  return (
    <Card
      variant={variant}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      borderColor={borderColor}
      width={width}
      {...props}
    >
      {children}
    </Card>
  );
};

export default BaseCard;
