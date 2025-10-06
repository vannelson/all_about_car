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
  RadioGroup,
  Radio,
  Wrap,
  WrapItem,
  Button,
  Text,
} from "@chakra-ui/react";

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
      <Popover isOpen={isOpen} onClose={onClose} placement="auto-start" closeOnBlur>
        <PopoverTrigger>
          <Box position="absolute" left={anchor.x} top={anchor.y} width="1px" height="1px" />
        </PopoverTrigger>
        <PopoverContent width="260px" p={0} shadow="lg" borderRadius="md">
          <PopoverArrow />
          <PopoverBody p={2}>
            <VStack spacing={2} align="stretch">
              <HStack spacing={2}>
                <Input
                  type="datetime-local"
                  size="sm"
                  value={startAt}
                  onChange={(e) => onChangeStart?.(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  size="sm"
                  value={endAt}
                  onChange={(e) => onChangeEnd?.(e.target.value)}
                />
              </HStack>
              <RadioGroup value={status} onChange={onChangeStatus}>
                <Wrap spacing={3}>
                  <WrapItem>
                    <Radio value="available" size="sm">Available</Radio>
                  </WrapItem>
                  <WrapItem>
                    <Radio value="unavailable" size="sm">Not Available</Radio>
                  </WrapItem>
                  <WrapItem>
                    <Radio value="all" size="sm">All</Radio>
                  </WrapItem>
                </Wrap>
              </RadioGroup>
              <VStack spacing={2} align="stretch">
                <Button size="sm" colorScheme="blue" onClick={() => { onClose?.(); onCreate?.(); }}>
                  Create Booking
                </Button>
                <Button size="sm" variant="outline" onClick={() => { onApply?.(); onClose?.(); }}>
                  Show Available Cars
                </Button>
              </VStack>
              <Text fontSize="xs" color="gray.500">
                {startAt && endAt ? `${new Date(startAt).toLocaleString()} → ${new Date(endAt).toLocaleString()}` : ''}
              </Text>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

