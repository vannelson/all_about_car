import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Textarea,
  Stack,
  HStack,
  Alert,
  AlertIcon,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Icon,
  FormLabel,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiHash,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";

const DEFAULT_METHODS = ["Cash", "Credit Card", "Bank Transfer", "Online", "Cheque"];
const DEFAULT_STATUSES = ["Paid", "Pending", "Failed", "Refunded", "Cancelled"];

function toISOStringLocal(dateValue) {
  try {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString();
  } catch {
    return "";
  }
}

function toDatetimeLocalInput(dateValue) {
  if (!dateValue) return "";
  try {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}`;
  } catch {
    return "";
  }
}

export default function RecordPaymentForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverErrors = {},
  allowCancel = false,
  isDisabled = false,
}) {
  const [amount, setAmount] = useState(defaultValues.amount ?? "0");
  const [method, setMethod] = useState(defaultValues.method || DEFAULT_METHODS[0]);
  const [status, setStatus] = useState(defaultValues.status || "Paid");
  const [reference, setReference] = useState(defaultValues.reference || "");
  const [notes, setNotes] = useState(defaultValues.notes || "");
  const [paidAt, setPaidAt] = useState(
    defaultValues.paid_at
      ? toDatetimeLocalInput(defaultValues.paid_at)
      : toDatetimeLocalInput(new Date())
  );
  const [amountTouched, setAmountTouched] = useState(false);

  useEffect(() => {
    if (!defaultValues) return;
    setAmount(defaultValues.amount ?? "0");
    setMethod(defaultValues.method || DEFAULT_METHODS[0]);
    setStatus(defaultValues.status || "Paid");
    setReference(defaultValues.reference || "");
    setNotes(defaultValues.notes || "");
    setPaidAt(
      defaultValues.paid_at
        ? toDatetimeLocalInput(defaultValues.paid_at)
        : toDatetimeLocalInput(new Date())
    );
    setAmountTouched(false);
  }, [defaultValues]);

  const fieldError = (field) => {
    if (!serverErrors) return null;
    const source =
      (serverErrors.errors && serverErrors.errors[field]) || serverErrors[field];
    const error = source;
    if (!error) return null;
    return Array.isArray(error) ? error.join(" ") : String(error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setAmountTouched(true);
      return;
    }
    onSubmit?.({
      amount: parsedAmount,
      method,
      status,
      reference: reference || undefined,
      paid_at: toISOStringLocal(paidAt),
      meta: notes ? { notes } : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {serverErrors?.message ? (
          <Alert status="error">
            <AlertIcon />
            {serverErrors.message}
          </Alert>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <FormControl isRequired isInvalid={Boolean(fieldError("amount"))}>
            <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
              <Icon as={FiDollarSign} /> Amount
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiDollarSign />
              </InputLeftElement>
              <NumberInput
                min={0}
                precision={2}
                value={amount}
                onChange={(value) => setAmount(value)}
                isDisabled={isSubmitting || isDisabled}
                onBlur={() => setAmountTouched(true)}
                w="100%"
              >
                <NumberInputField pl={8} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
            <FormErrorMessage>
              {fieldError("amount") ||
                (amountTouched && (!amount || Number(amount) <= 0)
                  ? "Amount must be greater than zero."
                  : null)}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(fieldError("paid_at"))}>
            <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
              <Icon as={FiCalendar} /> Paid at
            </FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiCalendar />
              </InputLeftElement>
              <Input
                type="datetime-local"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                isDisabled={isSubmitting || isDisabled}
                pl={8}
              />
            </InputGroup>
            <FormErrorMessage>{fieldError("paid_at")}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <FormControl isInvalid={Boolean(fieldError("method"))}>
            <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
              <Icon as={FiCreditCard} /> Method
            </FormLabel>
            <Select
              size="sm"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              isDisabled={isSubmitting || isDisabled}
            >
              {DEFAULT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{fieldError("method")}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(fieldError("status"))}>
            <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
              <Icon as={FiCheckCircle} /> Status
            </FormLabel>
            <Select
              size="sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              isDisabled={isSubmitting || isDisabled}
            >
              {DEFAULT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{fieldError("status")}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={Boolean(fieldError("reference"))}>
          <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
            <Icon as={FiHash} /> Reference
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.400">
              <FiHash />
            </InputLeftElement>
            <Input
              placeholder="INV-2025-001"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              isDisabled={isSubmitting || isDisabled}
              pl={8}
            />
          </InputGroup>
          <FormErrorMessage>{fieldError("reference")}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(fieldError("meta"))}>
          <FormLabel fontSize="xs" color="gray.500" display="flex" alignItems="center" gap={2}>
            <Icon as={FiFileText} /> Notes
          </FormLabel>
          <Textarea
            rows={2}
            placeholder="Optional internal notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            isDisabled={isSubmitting || isDisabled}
          />
          <FormErrorMessage>{fieldError("meta")}</FormErrorMessage>
        </FormControl>

        <HStack justify="flex-end">
          {allowCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              isDisabled={isSubmitting || isDisabled}
            >
              Clear
            </Button>
          )}
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isDisabled || isSubmitting}
          >
            Record Payment
          </Button>
        </HStack>
      </Stack>
    </form>
  );
}
