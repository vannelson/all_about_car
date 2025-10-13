import { axiosInstance } from "./api";

function buildListParams({ filters = {}, pagination = {}, order } = {}) {
  const params = {};
  const { status, method, reference, from, to } = filters || {};
  if (status) params["filters[status]"] = status;
  if (method) params["filters[method]"] = method;
  if (reference) params["filters[reference]"] = reference;
  if (from) params["filters[from]"] = from;
  if (to) params["filters[to]"] = to;
  if (order != null) params.order = order;

  const { page, limit } = pagination || {};
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return params;
}

export async function listPayments({ bookingId, filters, pagination, order } = {}) {
  if (!bookingId) {
    throw new Error("bookingId is required to list payments");
  }
  const params = buildListParams({ filters, pagination, order });
  const res = await axiosInstance.get(`/bookings/${bookingId}/payments`, { params });
  return res.data;
}

export async function createPayment({ bookingId, body }) {
  if (!bookingId) {
    throw new Error("bookingId is required to create payment");
  }
  const payload = { ...body };
  const res = await axiosInstance.post(`/bookings/${bookingId}/payments`, payload);
  return res.data;
}

