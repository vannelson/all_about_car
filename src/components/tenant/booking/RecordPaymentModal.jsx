import { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Select,
  Textarea,
  Button,
  HStack,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import BaseModal from "../../base/BaseModal";
import { createBookingPaymentApi } from "../../../services/bookings";

const PAYMENT_METHODS = ["Credit Card", "Cash", "Bank Transfer", "Online", "Cheque"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded", "Cancelled"];

export default function RecordPaymentModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
  defaultAmount,
}) {
  const toast = useToast();
  const [amount, setAmount] = useState("0");
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [status, setStatus] = useState("Paid");
  const [reference, setReference] = useState("");
  const [processor, setProcessor] = useState("Stripe");
  const [paidAt, setPaidAt] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bookingId = booking?.id;
  const suggestedAmount = useMemo(() => {
    if (defaultAmount != null) return Number(defaultAmount) || 0;
    return Number(booking?.total_amount) || 0;
  }, [defaultAmount, booking]);

  useEffect(() => {
    if (!isOpen) return;
    setAmount(String(suggestedAmount || 0));
    setMethod(PAYMENT_METHODS[0]);
    setStatus("Paid");
    setReference("");
    setProcessor("Stripe");
    setNotes("");
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setPaidAt(
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}`
    );
  }, [isOpen, suggestedAmount]);

  const resetAndClose = () => {
    if (!submitting) onClose?.();
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      toast({ title: "Booking not found", status: "error" });
      return;
    }
    const amountValue = Number(amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      toast({ title: "Invalid amount", status: "warning" });
      return;
    }
    if (!paidAt) {
      toast({ title: "Paid at is required", status: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        amount: amountValue,
        status,
        method,
        reference: reference || undefined,
        paid_at: new Date(paidAt).toISOString(),
        meta: processor || notes ? { processor, notes } : undefined,
      };
      if (!payload.meta) {
        delete payload.meta;
      }
      const response = await createBookingPaymentApi({
        bookingId,
        ...payload,
      });
      onSuccess?.(response, payload);
      toast({ title: "Payment recorded", status: "success" });
      onClose?.();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to record payment";
      toast({ title: message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={resetAndClose}
      size="md"
      title="Record Payment"
      hassFooter={false}
    >
      <Stack spacing={5} p={4} bg="white">
        <FormControl isRequired>
          <FormLabel>Amount</FormLabel>
          <NumberInput
            min={0}
            precision={2}
            value={amount}
            onChange={(value) => setAmount(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <HStack spacing={4} align="flex-start">
          <FormControl flex={1}>
            <FormLabel>Method</FormLabel>
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl flex={1}>
            <FormLabel>Status</FormLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>

        <HStack spacing={4} align="flex-start">
          <FormControl flex={1}>
            <FormLabel>Reference</FormLabel>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="INV-2025-001"
            />
          </FormControl>
          <FormControl flex={1}>
            <FormLabel>Processor</FormLabel>
            <Input
              value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              placeholder="Stripe"
            />
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Paid at</FormLabel>
          <Input type="datetime-local" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
        </FormControl>

        <Divider />

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional payment notes"
            rows={3}
          />
        </FormControl>

        <HStack justify="flex-end" pt={2} spacing={3}>
          <Button variant="ghost" onClick={resetAndClose} isDisabled={submitting}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={submitting}
            loadingText="Saving"
          >
            Save Payment
          </Button>
        </HStack>
      </Stack>
    </BaseModal>
  );
}
