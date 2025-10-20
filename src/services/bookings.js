import { axiosInstance } from "./api";
import { getActiveCompanyId } from "../utils/company";

// Create a booking
// Minimal shape per sample; extra keys in body will be sent as-is if included
export async function createBookingApi(body) {
  const { company_id, companyId, ...rest } = body || {};
  const payload = { ...rest };
  const resolvedCompanyId =
    company_id ?? companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    payload.company_id = resolvedCompanyId;
  }
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
}

// Update a booking (e.g., status, return dates)
export async function updateBookingApi({ id, ...fields }) {
  const { company_id, companyId, ...rest } = fields || {};
  const payload = { ...rest };
  const resolvedCompanyId =
    company_id ?? companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    payload.company_id = resolvedCompanyId;
  }
  const res = await axiosInstance.put(`/bookings/${id}`, payload);
  return res.data;
}

// List bookings filtered by month (YYYY-MM)
export async function listBookingsApi({ month, week, year, page = 1, limit, includes = ["car"] } = {}) {
  const params = {};
  // Prefer week/year if provided; otherwise fall back to month
  if (week && year) {
    params["filters[week]"] = week;
    params["filters[year]"] = year;
  } else if (month) {
    params["filters[month]"] = month;
  }
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (Array.isArray(includes) && includes.length > 0) {
    // Laravel-style include[]=car
    params["include[]"] = includes;
  }
  const companyId = getActiveCompanyId();
  if (companyId !== undefined && companyId !== null && params["filters[company_id]"] == null) {
    params["filters[company_id]"] = companyId;
  }
  const res = await axiosInstance.get("/bookings", { params });
  return res.data; // { status, message, data, links, meta }
}

export async function createBookingPaymentApi({ bookingId, ...fields }) {
  if (!bookingId) {
    throw new Error("bookingId is required to record a payment");
  }
  const payload = { ...fields };
  const res = await axiosInstance.post(`/bookings/${bookingId}/payments`, payload);
  return res.data;
}
