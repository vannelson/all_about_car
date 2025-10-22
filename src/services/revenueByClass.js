import { axiosInstance } from "./api";
import { getActiveCompanyId, getPersistedAuth } from "../utils/company";

export async function fetchRevenueByClass({
  companyId,
  preset,
  startDate,
  endDate,
  timezone,
  limit,
  includeOthers = true,
  asOf,
} = {}) {
  const params = {};

  const resolvedCompanyId = companyId ?? getActiveCompanyId();
  if (resolvedCompanyId !== undefined && resolvedCompanyId !== null) {
    params.company_id = resolvedCompanyId;
  }

  if (preset) params.preset = preset;
  if (timezone) params.timezone = timezone;
  if (limit != null) params.limit = limit;
  if (includeOthers !== undefined && includeOthers !== null) {
    params.include_others = includeOthers ? "true" : "false";
  }
  if (asOf) params.as_of = asOf.substring(0, 10);

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
    "/tenant/dashboard/revenue-by-class",
    {
      params,
      headers,
    }
  );

  return response.data;
}

export default fetchRevenueByClass;
