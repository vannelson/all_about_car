import { axiosInstance } from "./api";

// Create a booking
// Minimal shape per sample; extra keys in body will be sent as-is if included
export async function createBookingApi(body) {
  const payload = { ...body };
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
}

// Update a booking (e.g., status, return dates)
export async function updateBookingApi({ id, ...fields }) {
  const payload = { ...fields };
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
  const res = await axiosInstance.get("/bookings", { params });
  return res.data; // { status, message, data, links, meta }
}
