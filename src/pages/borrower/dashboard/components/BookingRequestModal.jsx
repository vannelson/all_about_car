import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { createBookingApi } from "../../../../services/bookings";
import { formatDateTimeLocalToApi } from "../../../../utils/booking";

const defaultForm = {
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  pickupLocation: "",
  dropoffLocation: "",
  notes: "",
};

function combineDateTime(date, time) {
  if (!date) return null;
  const effectiveTime = time && time.length > 0 ? time : "09:00";
  return new Date(`${date}T${effectiveTime}`);
}

export default function BookingRequestModal({
  isOpen,
  onClose,
  car,
  defaults = defaultForm,
}) {
  const toast = useToast();
  const auth = useSelector((state) => state.auth);
  const [form, setForm] = useState({ ...defaultForm });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm((prev) => ({
      ...prev,
      ...defaultForm,
      ...(defaults || {}),
    }));
  }, [isOpen, defaults]);

  useEffect(() => {
    if (!isOpen || !car) return;
    setForm((prev) => ({
      ...prev,
      pickupLocation: prev.pickupLocation || defaults?.pickupLocation || "",
      dropoffLocation: prev.dropoffLocation || defaults?.dropoffLocation || "",
    }));
  }, [isOpen, car, defaults]);

  const borrowerId = useMemo(() => auth?.user?.id ?? null, [auth]);

  const handleChange = (key) => (event) => {
    const value = event?.target?.value ?? "";
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!car?.id) {
      toast({
        title: "Select a vehicle first",
        status: "error",
      });
      return;
    }
    if (!form.pickupDate) {
      toast({
        title: "Pickup date is required",
        status: "error",
      });
      return;
    }
    const pickupDateTime = combineDateTime(form.pickupDate, form.pickupTime);
    const returnDateTime = combineDateTime(
      form.returnDate || form.pickupDate,
      form.returnTime || form.pickupTime
    );
    if (!pickupDateTime || !returnDateTime || returnDateTime <= pickupDateTime) {
      toast({
        title: "Return time must be after pickup time",
        status: "error",
      });
      return;
    }

    const payload = {
      car_id: car.id,
      borrower_id: borrowerId,
      pickup_location: form.pickupLocation || null,
      dropoff_location: form.dropoffLocation || form.pickupLocation || null,
      start_date: formatDateTimeLocalToApi(pickupDateTime),
      end_date: formatDateTimeLocalToApi(returnDateTime),
      expected_return_date: formatDateTimeLocalToApi(returnDateTime),
      notes: form.notes || null,
      status: "Pending",
      source: "borrower_portal",
    };

    if (car.raw?.company_id) {
      payload.company_id = car.raw.company_id;
    }
    if (car.raw?.company?.id) {
      payload.company_id = car.raw.company.id;
    }
    if (car.raw?.tenant_id) {
      payload.tenant_id = car.raw.tenant_id;
    } else if (car.raw?.company?.tenant_id) {
      payload.tenant_id = car.raw.company.tenant_id;
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    try {
      setSubmitting(true);
      const response = await createBookingApi(payload);
      const created = response?.data || response || {};
      try {
        window.dispatchEvent(
          new CustomEvent("tc:bookingRequestCreated", {
            detail: {
              ...payload,
              ...created,
              car,
            },
          })
        );
      } catch {}
      toast({
        title: "Booking request sent",
        description:
          "We notified the fleet owner. You will receive updates through email.",
        status: "success",
      });
      onClose?.();
    } catch (error) {
      const description =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send booking request";
      toast({
        title: "Something went wrong",
        description,
        status: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {car?.name ? `Request ${car.name}` : "Request booking"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <Stack spacing={0}>
              <FormControl>
                <FormLabel>Pickup date</FormLabel>
                <Input
                  type="date"
                  value={form.pickupDate}
                  onChange={handleChange("pickupDate")}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Pickup time</FormLabel>
                <Input
                  type="time"
                  value={form.pickupTime}
                  onChange={handleChange("pickupTime")}
                />
              </FormControl>
            </Stack>

            <Stack spacing={0}>
              <FormControl>
                <FormLabel>Return date</FormLabel>
                <Input
                  type="date"
                  value={form.returnDate}
                  onChange={handleChange("returnDate")}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Return time</FormLabel>
                <Input
                  type="time"
                  value={form.returnTime}
                  onChange={handleChange("returnTime")}
                />
              </FormControl>
            </Stack>

            <FormControl>
              <FormLabel>Pickup location</FormLabel>
              <Input
                placeholder="Where should we prepare the car?"
                value={form.pickupLocation}
                onChange={handleChange("pickupLocation")}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Drop-off location</FormLabel>
              <Input
                placeholder="Return location (optional)"
                value={form.dropoffLocation}
                onChange={handleChange("dropoffLocation")}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes for the owner</FormLabel>
              <Textarea
                placeholder="Add special requests or additional details."
                value={form.notes}
                onChange={handleChange("notes")}
                rows={4}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose} mr={3} variant="ghost">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Send request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
