import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

export async function fetchUpcomingBookings({
  companyId,
  startDate,
  endDate,
  limit,
  timezone,
  includeWaitlist,
} = {}) {
  const params = {};

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (timezone) params.timezone = timezone;
  if (limit) params.limit = limit;

  if (includeWaitlist !== undefined && includeWaitlist !== null) {
    params.include_waitlist = includeWaitlist ? "true" : "false";
  }

  const auth = getPersistedAuth();
  const token =
    auth?.token ??
    auth?.access_token ??
    auth?.user?.token ??
    null;

  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axiosInstance.get(
    "/tenant/dashboard/upcoming-bookings",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchUpcomingBookings;
