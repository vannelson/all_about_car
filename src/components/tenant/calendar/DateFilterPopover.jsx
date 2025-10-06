import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  RadioGroup,
  Radio,
  Button,
  Text,
  Grid,
  Divider,
  Icon,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiPlus,
  FiFilter,
} from "react-icons/fi";

export default function DateFilterPopover({
  isOpen,
  onClose,
  anchor = { x: 0, y: 0 },
  startAt = "",
  endAt = "",
  onChangeStart,
  onChangeEnd,
  status = "available",
  onChangeStatus,
  onCreate,
  onApply,
}) {
  return (
    <>
      {/* Invisible trigger positioned at selection point */}
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="auto-start"
        closeOnBlur
      >
        <PopoverTrigger>
          <Box
            position="absolute"
            left={anchor.x}
            top={anchor.y}
            width="1px"
            height="1px"
          />
        </PopoverTrigger>
        <PopoverContent width="380px" p={0} shadow="xl" borderRadius="lg">
          <PopoverArrow />
          <PopoverBody p={2}>
            <VStack spacing={2} align="stretch">
              {/* Dates */}
              <Box
                bg="gray.50"
                borderWidth="1px"
                borderColor="gray.100"
                _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                p={2.5}
                borderRadius="md"
              >
                <Grid
                  templateColumns="74px 1fr"
                  columnGap={3}
                  rowGap={1}
                  alignItems="center"
                >
                  <Text fontSize="sm" color="gray.600" textAlign="right">
                    Start Date
                  </Text>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiCalendar} color="gray.500" boxSize={4} />
                    </InputLeftElement>
                    <Input
                      type="datetime-local"
                      fontSize="sm"
                      value={startAt}
                      onChange={(e) => onChangeStart?.(e.target.value)}
                      w="full"
                      step="60"
                      aria-label="Start date and time"
                    />
                  </InputGroup>
                  <Text fontSize="sm" color="gray.600" textAlign="right">
                    End Date
                  </Text>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiCalendar} color="gray.500" boxSize={4} />
                    </InputLeftElement>
                    <Input
                      type="datetime-local"
                      fontSize="sm"
                      value={endAt}
                      onChange={(e) => onChangeEnd?.(e.target.value)}
                      w="full"
                      step="60"
                      aria-label="End date and time"
                    />
                  </InputGroup>
                </Grid>
              </Box>

              {/* Availability status */}
              <Box
                borderWidth="1px"
                borderColor="gray.100"
                _dark={{ borderColor: "gray.600" }}
                p={2}
                borderRadius="md"
              >
                <RadioGroup value={status} onChange={onChangeStatus}>
                  <HStack spacing={6} align="center">
                    <Radio colorScheme="blue" value="available" size="sm">
                      Available
                    </Radio>
                    <Radio colorScheme="blue" value="unavailable" size="sm">
                      Not Available
                    </Radio>
                    <Radio colorScheme="blue" value="all" size="sm">
                      All
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>

              {/* Actions */}
              <HStack spacing={2}>
                <Button
                  flex={1}
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<FiPlus />}
                  onClick={() => {
                    onClose?.();
                    onCreate?.();
                  }}
                >
                  Create Booking
                </Button>
                <Button
                  flex={1}
                  size="sm"
                  variant="outline"
                  leftIcon={<FiFilter />}
                  onClick={() => {
                    onApply?.();
                    onClose?.();
                  }}
                >
                  Show Available Cars
                </Button>
              </HStack>

              {/* Caption */}
              <Divider />
              <Text fontSize="xs" color="gray.500">
                {startAt && endAt
                  ? `${new Date(startAt).toLocaleString()} → ${new Date(
                      endAt
                    ).toLocaleString()}`
                  : ""}
              </Text>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}
