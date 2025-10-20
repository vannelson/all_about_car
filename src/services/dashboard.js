import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

/**
 * Fetch dashboard summary metrics.
 * Mirrors backend query parameters while normalising defaults.
 */
export async function fetchDashboardSummary({
  year,
  preset = "year_to_date",
  startDate,
  endDate,
  dateField = "actual_return",
  companyId,
  carId,
  statuses,
  usePayments,
  includeTrend = true,
  currency,
} = {}) {
  const params = {};

  if (year) params.year = year;
  if (preset) params.preset = preset;
  if (dateField) params.date_field = dateField;
  if (currency) params.currency = currency;

  const resolvedCompanyId =
    companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (carId) params.car_id = carId;

  if (Array.isArray(statuses) && statuses.length > 0) {
    params["status[]"] = statuses;
  }

  if (usePayments !== undefined && usePayments !== null) {
    params.use_payments = usePayments ? "true" : "false";
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

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axiosInstance.get("/tenant/dashboard/summary", {
    params,
    headers,
  });
  return response.data;
}

export default fetchDashboardSummary;
