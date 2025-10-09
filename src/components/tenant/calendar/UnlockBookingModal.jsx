import { useEffect, useRef } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import BaseModal from "../../base/BaseModal";

export default function UnlockBookingModal({
  isOpen,
  onClose,
  password,
  onPasswordChange,
  onSubmit,
  isLoading,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (event) => {
    if (typeof onPasswordChange === "function") {
      onPasswordChange(event.target.value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <BaseModal
      title="Unlock Booking"
      size="sm"
      isOpen={isOpen}
      onClose={handleClose}
      hassFooter={false}
    >
      <Box p={6}>
        <Stack spacing={4}>
          <Text>Enter the unlock password to continue.</Text>
          <Input
            ref={inputRef}
            type="password"
            value={password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter password"
            autoComplete="off"
            isDisabled={isLoading}
          />
          <Stack direction="row" justify="flex-end" spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
              Unlock
            </Button>
          </Stack>
        </Stack>
      </Box>
    </BaseModal>
  );
}
