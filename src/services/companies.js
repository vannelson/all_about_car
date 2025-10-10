import { axiosInstance } from "./api";

const BASE_PATH = "/companies";

export async function listCompaniesApi({ page = 1, limit = 10, filters = {}, order = [] } = {}) {
  const params = { page, limit };

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      params[`filters[${key}]`] = value;
    }
  });

  if (Array.isArray(order) && order.length === 2) {
    params["order[0]"] = order[0];
    params["order[1]"] = order[1];
  }

  const res = await axiosInstance.get(BASE_PATH, { params });
  const payload = res.data || {};
  const rawData = payload.data;

  const items = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
    ? rawData.items
    : Array.isArray(payload.items)
    ? payload.items
    : [];

  const meta = payload.meta || rawData?.meta || null;
  const links = payload.links || rawData?.links || null;

  return {
    items,
    meta,
    links,
    raw: payload,
  };
}

export async function createCompanyApi({ user_id, name, address, industry, is_default = false, logo } = {}) {
  const form = new FormData();
  if (user_id !== undefined && user_id !== null) form.append("user_id", String(user_id));
  if (name !== undefined && name !== null) form.append("name", name);
  if (address !== undefined && address !== null) form.append("address", address);
  if (industry !== undefined && industry !== null) form.append("industry", industry);
  if (is_default !== undefined && is_default !== null) {
    form.append("is_default", is_default ? "true" : "false");
  }
  if (logo instanceof File || logo instanceof Blob) {
    form.append("logo", logo);
  }

  const res = await axiosInstance.post(BASE_PATH, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateCompanyApi(id, body) {
  const res = await axiosInstance.put(`${BASE_PATH}/${id}`, body);
  return res.data;
}

export async function toggleDefaultCompanyApi(id, isDefault) {
  const res = await axiosInstance.patch(`${BASE_PATH}/${id}`, { is_default: isDefault });
  return res.data;
}
