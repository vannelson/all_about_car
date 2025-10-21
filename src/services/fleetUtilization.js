import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

/**
 * Fetch the latest fleet utilisation metrics for the dashboard.
 */
export async function fetchFleetUtilization({
  preset = "year_to_date",
  startDate,
  endDate,
  companyId,
  timezone,
  includeTrend = true,
  granularity,
} = {}) {
  const params = {};

  if (preset) params.preset = preset;
  if (granularity) params.granularity = granularity;
  if (timezone) params.timezone = timezone;

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (includeTrend !== undefined && includeTrend !== null) {
    params.include_trend = includeTrend ? "true" : "false";
  }

  if (preset === "custom") {
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
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
    "/tenant/dashboard/fleet-utilization",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchFleetUtilization;
