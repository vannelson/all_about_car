import { axiosInstance } from "./api";

// Create a booking
// Minimal shape per sample; extra keys in body will be sent as-is if included
export async function createBookingApi(body) {
  const payload = { ...body };
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
}

// List bookings filtered by month (YYYY-MM)
export async function listBookingsApi({ month, page = 1, limit, includes = ["car"] } = {}) {
  const params = {};
  if (month) params["filters[month]"] = month;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (Array.isArray(includes) && includes.length > 0) {
    // Laravel-style include[]=car
    params["include[]"] = includes;
  }
  const res = await axiosInstance.get("/bookings", { params });
  return res.data; // { status, message, data, links, meta }
}
