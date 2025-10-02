const STORAGE_KEY = "travelcars_filters_topbar_v1";

export function loadTopbarFilters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Only allow expected keys
    const { gear = "", fuel = "", brand = "", availability = "", search = "" } = parsed || {};
    return { gear, fuel, brand, availability, search };
  } catch {
    return {};
  }
}

export function saveTopbarFilters(value = {}) {
  try {
    const toSave = {
      gear: value.gear || "",
      fuel: value.fuel || "",
      brand: value.brand || "",
      availability: value.availability || "",
      search: value.search || "",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

