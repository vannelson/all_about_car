import { axiosInstance } from "./api";

// Create a booking
// Minimal shape per sample; extra keys in body will be sent as-is if included
export async function createBookingApi(body) {
  const payload = { ...body };
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
}

