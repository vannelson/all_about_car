import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Text,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiDollarSign, FiList } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import PaymentHistoryTable from "./PaymentHistoryTable";
import RecordPaymentForm from "./RecordPaymentForm";
import {
  fetchPayments,
  createBookingPayment,
  selectPaymentsByBooking,
  selectPaymentsStatus,
} from "../../../store/paymentsSlice";

export default function BookingPaymentsPanel({ bookingId, booking }) {
  const dispatch = useDispatch();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [formErrors, setFormErrors] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const paymentsState = useSelector(selectPaymentsByBooking(bookingId));
  const status = useSelector(selectPaymentsStatus(bookingId));

  const { items = [], pagination } = paymentsState;
  const serverMeta = pagination?.meta;
  const resolvedLastPage = serverMeta?.last_page ?? pagination?.lastPage ?? 1;
  const hasNext = (pagination?.page || page) < resolvedLastPage;

  const isLoading = status === "loading";
  const loadError = paymentsState.error;

  const defaultFormValues = useMemo(
    () => ({
      amount: booking?.total_amount ?? "0",
      status: "Paid",
      method: "Cash",
      reference: "",
      paid_at: booking?.created_at || new Date().toISOString(),
    }),
    [booking?.total_amount, booking?.created_at]
  );

  useEffect(() => {
    setPage(1);
    setLimit(10);
    setSearchTerm("");
    setTabIndex(0);
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;
    dispatch(
      fetchPayments({
        bookingId,
        pagination: { page, limit },
      })
    );
  }, [bookingId, dispatch, page, limit]);

  const totals = useMemo(() => {
    const totalPaid = items.reduce(
      (acc, payment) => acc + (Number(payment.amount) || 0),
      0
    );
    const totalAmount = Number(booking?.total_amount || 0);
    const outstanding = Math.max(totalAmount - totalPaid, 0);
    return {
      totalPaid,
      totalAmount,
      outstanding,
      paymentStatus: outstanding <= 0 ? "Paid" : "Pending",
    };
  }, [items, booking?.total_amount]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((payment) => {
      const haystack = [
        payment.reference,
        payment.method,
        payment.status,
        payment.amount,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [items, searchTerm]);

  const handlePaginate = useCallback((nextPage, nextLimit) => {
    setPage(nextPage);
    setLimit(nextLimit);
  }, []);

  const handleCreatePayment = async (values) => {
    if (!bookingId) return;
    if (totals.paymentStatus === "Paid") {
      toast({
        title: "Booking already marked as paid",
        description: "No additional payment is required for this booking.",
        status: "info",
      });
      return;
    }
    setFormErrors(null);
    try {
      await dispatch(
        createBookingPayment({
          bookingId,
          payload: values,
        })
      ).unwrap();
      toast({
        title: "Payment recorded successfully",
        status: "success",
      });
      setFormKey((key) => key + 1);
      setSearchTerm("");
      dispatch(
        fetchPayments({
          bookingId,
          pagination: { page, limit },
        })
      );
    } catch (err) {
      const errorPayload = err?.error || err;
      setFormErrors(errorPayload);
      const message =
        errorPayload?.message || "Failed to record payment. Please try again.";
      toast({
        title: message,
        status: "error",
      });
    }
  };

  const handleClearForm = useCallback(() => {
    setFormErrors(null);
    setFormKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    const { totalPaid, outstanding, paymentStatus } = totals;
    try {
      window.dispatchEvent(
        new CustomEvent("tc:bookingUpdated", {
          detail: {
            id: bookingId,
            payment_status: paymentStatus,
            total_paid: totalPaid,
            outstanding,
          },
        })
      );
    } catch {
      // ignore
    }

    try {
      const cached = localStorage.getItem("selectedBookingInfo");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id === bookingId) {
          localStorage.setItem(
            "selectedBookingInfo",
            JSON.stringify({
              ...parsed,
              payment_status: paymentStatus,
              total_paid: totalPaid,
              outstanding,
            })
          );
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [bookingId, totals]);

  const summaryText = useMemo(() => {
    if (!items.length) return "No payments recorded yet.";
    const total = serverMeta?.total ?? items.length;
    const plural = total === 1 ? "payment" : "payments";
    return `Showing ${items.length} of ${total} ${plural}.`;
  }, [items.length, serverMeta?.total]);

  return (
    <Tabs
      colorScheme="blue"
      isFitted
      index={tabIndex}
      onChange={(index) => setTabIndex(index)}
    >
      <TabList mb={4} mt={2} px={{ base: 1, md: 2 }}>
        <Tab gap={2} py={2} isDisabled={totals.paymentStatus === "Paid"}>
          <Icon as={FiDollarSign} />
          Record
        </Tab>
        <Tab gap={2} py={2}>
          <Icon as={FiList} />
          History
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={{ base: 0, md: 1 }} py={4}>
          <Stack spacing={3}>
            {totals.paymentStatus === "Paid" ? (
              <Alert status="success">
                <AlertIcon />
                This booking is already paid in full.
              </Alert>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Capture renter payments in one step.
              </Text>
            )}
            <RecordPaymentForm
              key={formKey}
              onSubmit={handleCreatePayment}
              onCancel={handleClearForm}
              serverErrors={formErrors}
              isSubmitting={paymentsState.formStatus === "loading"}
              defaultValues={defaultFormValues}
              allowCancel
              isDisabled={totals.paymentStatus === "Paid"}
            />
          </Stack>
        </TabPanel>

        <TabPanel px={{ base: 0, md: 1 }} py={4}>
          {status === "failed" && loadError ? (
            <Alert status="error" mb={3}>
              <AlertIcon />
              {loadError.message || "Failed to load payments."}
            </Alert>
          ) : (
            <Text fontSize="sm" mb={3} color="gray.500">
              {summaryText}
            </Text>
          )}
          <PaymentHistoryTable
            items={filteredItems}
            isLoading={isLoading}
            page={pagination?.page || page}
            limit={pagination?.limit || limit}
            hasNext={hasNext}
            meta={pagination}
            onPaginate={handlePaginate}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
