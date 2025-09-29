import { axiosInstance } from "./api";

function dataUrlToFile(dataUrl, filename) {
  try {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  } catch {
    return null;
  }
}

export async function createCarApi({
  fields,
  features = [],
  profileImage,
  displayImages = [],
  companyId,
}) {
  // Build multipart/form-data per CARAPI.png
  const form = new FormData();
  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });

  // Ensure company_id is present even if not in fields
  if (companyId !== undefined && companyId !== null) {
    form.set("company_id", String(companyId));
  }

  // features[]
  features.forEach((f) => form.append("features[]", f));

  // profileImageFile
  if (profileImage instanceof File || profileImage instanceof Blob) {
    form.append("profileImageFile", profileImage);
  } else if (typeof profileImage === "string" && profileImage.startsWith("data:")) {
    const f = dataUrlToFile(profileImage, "profile.png");
    if (f) form.append("profileImageFile", f);
  }

  // displayImagesFiles[]
  (displayImages || []).forEach((img, idx) => {
    if (img instanceof File || img instanceof Blob) {
      form.append("displayImagesFiles[]", img);
    } else if (typeof img === "string" && img.startsWith("data:")) {
      const f = dataUrlToFile(img, `display-${idx + 1}.png`);
      if (f) form.append("displayImagesFiles[]", f);
    }
  });

  // Let axios set the multipart boundary automatically
  if (import.meta?.env?.DEV) {
    try {
      // Log form keys in dev to verify payload shape
      // Note: DevTools already shows this, but this helps console tracing
      // Do not log file contents
      // eslint-disable-next-line no-console
      console.groupCollapsed("[cars] FormData payload");
      for (const [k, v] of form.entries()) {
        // eslint-disable-next-line no-console
        console.log(k, v instanceof File ? `File(${v.name}, ${v.size})` : v);
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    } catch {}
  }

  const res = await axiosInstance.post("/cars", form);
  return res.data;
}

export async function updateCarApi({
  id,
  fields,
  features = [],
  profileImage,
  displayImages = [],
  companyId,
}) {
  const form = new FormData();
  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });

  if (companyId !== undefined && companyId !== null) {
    form.set("company_id", String(companyId));
  }

  // features[] overwrite
  features.forEach((f) => form.append("features[]", f));

  // Optional images: only append if provided (to keep existing ones otherwise)
  if (profileImage) {
    if (profileImage instanceof File || profileImage instanceof Blob) {
      form.append("profileImageFile", profileImage);
    } else if (typeof profileImage === "string" && profileImage.startsWith("data:")) {
      const f = dataUrlToFile(profileImage, "profile.png");
      if (f) form.append("profileImageFile", f);
    }
  }
  (displayImages || []).forEach((img, idx) => {
    if (img instanceof File || img instanceof Blob) {
      form.append("displayImagesFiles[]", img);
    } else if (typeof img === "string" && img.startsWith("data:")) {
      const f = dataUrlToFile(img, `display-${idx + 1}.png`);
      if (f) form.append("displayImagesFiles[]", f);
    }
  });

  // Some backends (Laravel) prefer method override for multipart updates
  form.append("_method", "PUT");
  const res = await axiosInstance.post(`/cars/${id}`, form);
  return res.data;
}

// Fetch cars with pagination and includes per APIdocs
export async function listCarsApi({ limit = 6, page = 1, includes = ["rates", "company", "bookings"], filters = {} } = {}) {
  const params = { limit, page };
  // Laravel-style include[]= syntax
  (includes || []).forEach((inc, idx) => {
    params[`include[${idx}]`] = inc;
  });
  // Laravel-style filters[<column>]=value
  if (filters && typeof filters === "object") {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && String(val).length > 0) {
        params[`filters[${key}]`] = val;
      }
    });
  }

  const res = await axiosInstance.get("/cars", { params });
  return res.data; // expected: { status, message, data: [...], meta, links }
}

// Map API car to view model used by Card/Table components
export function mapCarToViewModel(apiCar) {
  if (!apiCar || typeof apiCar !== "object") return null;

  const statusRaw = String(apiCar.info_availabilityStatus || "").toLowerCase();
  const isAvailable = statusRaw === "available";

  // Attempt to extract rates (daily/hourly) if provided
  const rates = (Array.isArray(apiCar.rates) ? apiCar.rates : []).filter(
    (r) => String(r?.status || "active").toLowerCase() === "active"
  );
  const findRate = (key) => {
    // try common keys
    const r = rates.find(
      (x) =>
        String(x?.type || x?.name || "").toLowerCase().includes(String(key).toLowerCase()) ||
        String(x?.unit || "").toLowerCase().includes(String(key).toLowerCase())
    );
    const amount = r?.amount ?? r?.price ?? r?.rate ?? 0;
    return Number(amount) || 0;
  };

  const daily = findRate("day") || findRate("daily");
  const hourly = findRate("hour") || findRate("hourly");

  const formatMoney = (n) => {
    const num = Number(n) || 0;
    return num.toLocaleString();
  };

  const specification = [
    { key: "age", value: apiCar.info_age ? `${apiCar.info_age} year(s) old` : undefined },
    { key: "seats", value: apiCar.spcs_seats != null ? `${apiCar.spcs_seats} seats` : undefined },
    {
      key: "luggage_capacity",
      value:
        apiCar.spcs_smallBags != null
          ? `${apiCar.spcs_smallBags} small bag${apiCar.spcs_smallBags === 1 ? "" : "s"}`
          : undefined,
    },
    {
      key: "engine_capacity_cc",
      value: apiCar.spcs_engineSize != null ? `${apiCar.spcs_engineSize} cc engine` : undefined,
    },
    { key: "transmission", value: apiCar.spcs_transmission },
    { key: "fuel_type", value: apiCar.spcs_fuelType },
    {
      key: "fuel_efficiency_rate",
      value: apiCar.spcs_fuelEfficiency ? `${apiCar.spcs_fuelEfficiency} L / 100km` : undefined,
    },
  ].filter((x) => x.value !== undefined);

  const name = [apiCar.info_make, apiCar.info_model].filter(Boolean).join(" ") || "Car";
  const image = apiCar.profileImage || "/cars/1.jpg";
  const displayImages = Array.isArray(apiCar.displayImages) ? apiCar.displayImages : [];

  // best-effort bookings passthrough; structure may vary
  const bookings = Array.isArray(apiCar.bookings) ? apiCar.bookings : [];

  return {
    id: apiCar.id,
    name,
    image,
    status: isAvailable ? "Available" : "Unavailable",
    rateType: daily ? "Day" : hourly ? "Hour" : "Day",
    rateAmount: formatMoney(daily || hourly || 0),
    rates: { daily, hourly },
    specification,
    images: { profileImage: image, displayImages },
    bookings,
    raw: apiCar,
  };
}

// Create a car rate entry after car creation
export async function createCarRateApi({
  car_id,
  rate,
  rate_type = "daily",
  name = "Standard Rate",
  start_date, // YYYY-MM-DD
  status = "active",
}) {
  const body = {
    car_id,
    name,
    rate: Number(rate),
    rate_type: String(rate_type).toLowerCase(),
    start_date: start_date || new Date().toISOString().slice(0, 10),
    status,
  };
  const res = await axiosInstance.post("/car-rates", body);
  return res.data;
}

// List car rates with filters, order, pagination
export async function listCarRatesApi({ page = 1, limit = 10, filters = {}, order = [] } = {}) {
  const params = { page, limit };
  if (filters && typeof filters === "object") {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).length > 0) {
        params[`filters[${k}]`] = v;
      }
    });
  }
  if (Array.isArray(order) && order.length === 2) {
    params[`order[0]`] = order[0];
    params[`order[1]`] = order[1];
  }
  const res = await axiosInstance.get("/car-rates", { params });
  return res.data; // { data, meta, links }
}

// Update a car rate (e.g., status)
export async function updateCarRateApi({ id, status }) {
  const body = { status };
  const res = await axiosInstance.put(`/car-rates/${id}`, body);
  return res.data;
}

// Delete a rate
export async function deleteCarRateApi(id) {
  const res = await axiosInstance.delete(`/car-rates/${id}`);
  return res.data;
}
