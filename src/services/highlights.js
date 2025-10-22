import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

export async function fetchDashboardHighlights({
  companyId,
  asOf,
  timezone,
  includeTrend = true,
  granularity,
} = {}) {
  const params = {};

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (asOf) params.as_of = asOf.substring(0, 10);
  if (timezone) params.timezone = timezone;

  if (includeTrend !== undefined && includeTrend !== null) {
    params.include_trend = includeTrend ? "true" : "false";
  }

  if (granularity) params.granularity = granularity;

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
    "/tenant/dashboard/highlights",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchDashboardHighlights;
