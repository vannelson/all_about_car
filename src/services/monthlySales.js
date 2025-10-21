import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

/**
 * Fetch monthly sales data for the tenant dashboard.
 */
export async function fetchMonthlySales({
  year,
  startYear,
  endYear,
  asOf,
  companyId,
  timezone,
  includePrevious = true,
  granularity,
} = {}) {
  const params = {};

  if (year) params.year = year;
  if (startYear) params.start_year = startYear;
  if (endYear) params.end_year = endYear;
  if (asOf) params.as_of = asOf;
  if (timezone) params.timezone = timezone;

  if (includePrevious !== undefined && includePrevious !== null) {
    params.include_previous = includePrevious ? "true" : "false";
  }

  if (granularity) {
    params.granularity = granularity;
  }

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
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
    "/tenant/dashboard/monthly-sales",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchMonthlySales;
