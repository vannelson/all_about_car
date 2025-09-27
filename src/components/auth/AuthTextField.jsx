import { FormControl, FormLabel, Input, useColorModeValue, Box } from "@chakra-ui/react";

export default function AuthTextField({
  label,
  labelIcon: LabelIcon,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  className,
  autoComplete,
}) {
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBorder = useColorModeValue("gray.300", "gray.500");
  const focusRing = useColorModeValue("blue.100", "blue.900");
  const accent = useColorModeValue("blue.600", "blue.300");

  return (
    <FormControl>
      {label && (
        <FormLabel fontSize="sm" fontWeight="600" color={labelColor} mb={2} display="flex" alignItems="center" gap={2}>
          {LabelIcon && (
            <Box color={accent}>
              <LabelIcon size={14} />
            </Box>
          )}
          {label}
        </FormLabel>
      )}
      <Input
        size="lg"
        borderRadius="lg"
        borderColor={borderColor}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        autoComplete={autoComplete}
        className={className}
        transition="all 0.3s"
        _focus={{
          borderColor: "blue.600",
          boxShadow: `0 0 0 2px ${focusRing}`,
          transform: "scale(1.02)",
        }}
        _hover={{ borderColor: hoverBorder }}
        required
      />
    </FormControl>
  );
}

