import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

export async function fetchTopPerformers({
  companyId,
  preset,
  startDate,
  endDate,
  metric,
  limit,
  vehicleClass,
  includeTotals,
  timezone,
  asOf,
} = {}) {
  const params = {};

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (preset) params.preset = preset;
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (metric) params.metric = metric;
  if (limit) params.limit = limit;
  if (vehicleClass) params.vehicle_class = vehicleClass;
  if (timezone) params.timezone = timezone;
  if (asOf) params.as_of = asOf;

  if (includeTotals !== undefined && includeTotals !== null) {
    params.include_totals = includeTotals ? "true" : "false";
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
    "/tenant/dashboard/top-performers",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchTopPerformers;
