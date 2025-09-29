import React, { useMemo, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Input,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import BaseModal from "../../base/BaseModal";
import { createCarRateApi } from "../../../services/cars";
import RatesTable from "./RatesTable";

const RateCreateModal = ({ isOpen, onClose, car }) => {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    rate: 0,
    rate_type: "daily",
    name: "Standard Rate",
    start_date: new Date().toISOString().slice(0, 10),
    status: "active",
  });
  const [refreshTick, setRefreshTick] = useState(0);

  const carId = useMemo(() => car?.id || car?.raw?.id || car?.car_id, [car]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await createCarRateApi({
        car_id: carId,
        rate: Number(form.rate),
        rate_type: form.rate_type,
        name: form.name,
        start_date: form.start_date,
        status: form.status,
      });
      toast({ title: "Rate saved", status: "success" });
      setRefreshTick((t) => t + 1);
    } catch (e) {
      toast({ title: "Failed to save rate", description: e?.message || "", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={`Rates – ${car?.name || car?.raw?.info_make || "Vehicle"}`}
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      hassFooter={false}
    >
      <Box p={5}>
        <Box bg="yellow.50" border="1px solid" borderColor="yellow.200" borderRadius="md" p={3} mb={4}>
          <Text fontSize="sm" color="yellow.800">
            Note: Only one rate can be Active at a time. When you save a rate, it cannot be edited later (kept for reporting consistency). You may toggle its status or create a new rate.
          </Text>
        </Box>
        <HStack align="start" spacing={6}>
          {/* Left: Create Rate Form */}
          <Box flex={1}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Rate Amount</FormLabel>
                <NumberInput min={0} value={form.rate} onChange={(v) => setForm((p) => ({ ...p, rate: Number(v) || 0 }))}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Rate Type</FormLabel>
                <Select value={form.rate_type} onChange={(e) => setForm((p) => ({ ...p, rate_type: e.target.value }))}>
                  <option value="daily">Daily</option>
                  <option value="hourly">Hourly</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input type="date" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))} />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormControl>
              </HStack>
              <HStack justify="flex-end" pt={2}>
                <Button variant="ghost" onClick={onClose} isDisabled={submitting}>Close</Button>
                <Button colorScheme="blue" onClick={handleSubmit} isLoading={submitting}>Save Rate</Button>
              </HStack>
            </VStack>
          </Box>

          {/* Right: Rates Table */}
          <Box flex={2}>
            <RatesTable carId={carId} refreshSignal={refreshTick} />
          </Box>
        </HStack>
      </Box>
    </BaseModal>
  );
};

export default RateCreateModal;
