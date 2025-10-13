import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listPayments, createPayment } from "../services/payments";

function createBookingState() {
  return {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      lastPage: 1,
      meta: null,
      links: null,
    },
    filters: {},
    status: "idle",
    error: null,
    formStatus: "idle",
    formError: null,
  };
}

const initialBookingState = createBookingState();

const initialState = {
  byBookingId: {},
};

function ensureBookingState(state, bookingId) {
  if (!state.byBookingId[bookingId]) {
    state.byBookingId[bookingId] = createBookingState();
  }
  return state.byBookingId[bookingId];
}

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async ({ bookingId, filters = {}, pagination = {}, order } = {}, { rejectWithValue }) => {
    try {
      const response = await listPayments({ bookingId, filters, pagination, order });
      const items = response?.data || [];
      const meta = response?.meta || null;
      const links = response?.links || null;
      const currentPage = meta?.current_page || pagination.page || 1;
      const perPage = meta?.per_page || pagination.limit || 10;
      return {
        bookingId,
        items,
        meta,
        links,
        filters,
        pagination: {
          page: currentPage,
          limit: perPage,
          total: meta?.total ?? items.length,
          lastPage: meta?.last_page ?? Math.max(1, Math.ceil((meta?.total || items.length || 1) / perPage)),
        },
      };
    } catch (err) {
      const errorData = err?.response?.data || err?.data || { message: err?.message || "Failed to load payments" };
      return rejectWithValue({ bookingId, error: errorData });
    }
  }
);

export const createBookingPayment = createAsyncThunk(
  "payments/createPayment",
  async ({ bookingId, payload }, { rejectWithValue }) => {
    try {
      const response = await createPayment({ bookingId, body: payload });
      return {
        bookingId,
        payment: response?.data || null,
        message: response?.message || "Payment recorded successfully!",
      };
    } catch (err) {
      const errorData = err?.response?.data || err?.data || { message: err?.message || "Failed to create payment" };
      return rejectWithValue({ bookingId, error: errorData });
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentsState: (state, action) => {
      const bookingId = action.payload;
      if (bookingId) {
        delete state.byBookingId[bookingId];
      } else {
        state.byBookingId = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state, action) => {
        const bookingId = action.meta?.arg?.bookingId;
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.status = "loading";
        bookingState.error = null;
        if (action.meta?.arg?.filters) {
          bookingState.filters = { ...action.meta.arg.filters };
        }
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        const { bookingId, items, pagination, meta, links, filters } = action.payload || {};
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.items = items || [];
        bookingState.pagination = {
          ...bookingState.pagination,
          ...pagination,
          meta: meta || null,
          links: links || null,
        };
        bookingState.status = "succeeded";
        bookingState.error = null;
        bookingState.filters = { ...filters };
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        const bookingId = action.payload?.bookingId || action.meta?.arg?.bookingId;
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.status = "failed";
        bookingState.error = action.payload?.error || { message: "Failed to load payments" };
      })
      .addCase(createBookingPayment.pending, (state, action) => {
        const bookingId = action.meta?.arg?.bookingId;
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.formStatus = "loading";
        bookingState.formError = null;
      })
      .addCase(createBookingPayment.fulfilled, (state, action) => {
        const { bookingId, payment } = action.payload || {};
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.formStatus = "succeeded";
        bookingState.formError = null;
        if (payment) {
          // Optimistically prepend payment while waiting for refetch
          bookingState.items = [payment, ...(bookingState.items || [])];
          const currentTotal = bookingState.pagination?.total || 0;
          bookingState.pagination = {
            ...bookingState.pagination,
            total: currentTotal + 1,
          };
        }
      })
      .addCase(createBookingPayment.rejected, (state, action) => {
        const bookingId = action.payload?.bookingId || action.meta?.arg?.bookingId;
        if (!bookingId) return;
        const bookingState = ensureBookingState(state, bookingId);
        bookingState.formStatus = "failed";
        bookingState.formError = action.payload?.error || { message: "Failed to record payment" };
      });
  },
});

export const { clearPaymentsState } = paymentsSlice.actions;

export default paymentsSlice.reducer;

const selectPaymentsState = (state) => state.payments || initialState;

export const selectPaymentsByBooking = (bookingId) => (state) => {
  const slice = selectPaymentsState(state);
  if (!bookingId) return createBookingState();
  return slice.byBookingId[bookingId] || createBookingState();
};

export const selectPaymentsStatus = (bookingId) => (state) =>
  selectPaymentsByBooking(bookingId)(state).status;

export const selectPaymentsFormStatus = (bookingId) => (state) =>
  selectPaymentsByBooking(bookingId)(state).formStatus;

export const selectPaymentsError = (bookingId) => (state) =>
  selectPaymentsByBooking(bookingId)(state).error;

export const selectPaymentsFormError = (bookingId) => (state) =>
  selectPaymentsByBooking(bookingId)(state).formError;
