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

export async function createCompanyApi({
  user_id,
  name,
  address,
  industry,
  is_default = false,
  logo,
  latitude,
  longitude,
} = {}) {
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
  if (latitude !== undefined && latitude !== null && latitude !== "") {
    form.append("latitude", String(latitude));
  }
  if (longitude !== undefined && longitude !== null && longitude !== "") {
    form.append("longitude", String(longitude));
  }

  const res = await axiosInstance.post(BASE_PATH, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateCompanyApi(
  id,
  {
    name,
    address,
    industry,
    is_default,
    logo,
    latitude,
    longitude,
  } = {}
) {
  const url = `${BASE_PATH}/${id}`;

  const isFileLike = (value) => {
    if (!value) return false;
    const hasFileCtor = typeof File !== "undefined" && value instanceof File;
    const hasBlobCtor = typeof Blob !== "undefined" && value instanceof Blob;
    return hasFileCtor || hasBlobCtor;
  };

  const normalizeBoolean = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(normalized)) return true;
      if (["false", "0", "no", "off"].includes(normalized)) return false;
      return undefined;
    }
    if (typeof value === "number") return value === 1;
    return Boolean(value);
  };

  const formCompatible = isFileLike(logo);

  if (formCompatible) {
    const form = new FormData();

    const appendIfDefined = (key, value) => {
      if (value === undefined) return;
      if (value === null) return;
      form.append(key, value);
    };

    appendIfDefined("name", name);
    appendIfDefined("address", address);
    appendIfDefined("industry", industry);

    const normalizedDefault = normalizeBoolean(is_default);
    if (normalizedDefault !== undefined) {
      form.append("is_default", normalizedDefault ? "true" : "false");
    }

    if (latitude !== undefined && latitude !== null) {
      form.append("latitude", String(latitude));
    }

    if (longitude !== undefined && longitude !== null) {
      form.append("longitude", String(longitude));
    }

    form.append("logo", logo);

    const res = await axiosInstance.put(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const payload = {};

  const setIfDefined = (key, value) => {
    if (value !== undefined) {
      payload[key] = value;
    }
  };

  setIfDefined("name", name);
  setIfDefined("address", address);
  setIfDefined("industry", industry);

  const normalizedDefault = normalizeBoolean(is_default);
  if (normalizedDefault !== undefined) {
    payload.is_default = normalizedDefault;
  }

  setIfDefined("latitude", latitude);
  setIfDefined("longitude", longitude);

  const res = await axiosInstance.put(url, payload);
  return res.data;
}

export async function toggleDefaultCompanyApi(id, isDefault) {
  const res = await axiosInstance.patch(`${BASE_PATH}/${id}`, { is_default: isDefault });
  return res.data;
}
