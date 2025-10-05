// Numeric helper
export function toNumber(str = 0) {
  const n = Number(String(str ?? 0).toString().replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

// Date helpers
export function hoursBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e) || e <= s) return 0;
  return Math.ceil((e - s) / (1000 * 60 * 60));
}

export function daysBetween(start, end) {
  const hrs = hoursBetween(start, end);
  if (hrs === 0) return 0;
  return Math.ceil(hrs / 24);
}

export function computeQuantities(rateType = "daily", pickupAt, returnAt) {
  if (!pickupAt || !returnAt)
    return { qty: 0, label: rateType === "hourly" ? "hour(s)" : "day(s)" };
  if (rateType === "hourly") {
    const hrs = hoursBetween(pickupAt, returnAt);
    return { qty: hrs, label: "hour(s)" };
  }
  const d = daysBetween(pickupAt, returnAt);
  return { qty: d, label: "day(s)" };
}

export function computeActiveRates(effectiveCar) {
  const rawRates = effectiveCar?.raw?.rates;
  if (Array.isArray(rawRates)) {
    const actives = rawRates.filter((r) => String(r?.status || "").toLowerCase() === "active");
    const daily = toNumber(actives.find((r) => String(r?.rate_type || "").toLowerCase() === "daily")?.rate);
    const hourly = toNumber(actives.find((r) => String(r?.rate_type || "").toLowerCase() === "hourly")?.rate);
    return { daily, hourly };
  }
  const mapped = effectiveCar?.rates || {};
  return { daily: toNumber(mapped.daily), hourly: toNumber(mapped.hourly) };
}

export function chooseRateType(activeRates = {}, fallbackHint = "") {
  if (toNumber(activeRates.daily) > 0) return "daily";
  if (toNumber(activeRates.hourly) > 0) return "hourly";
  const hint = String(fallbackHint || "").toLowerCase();
  if (hint.includes("hour")) return "hourly";
  return "daily";
}

export function computeBaseRate(activeRates = {}, chosenRateType = "daily") {
  return toNumber(chosenRateType === "hourly" ? activeRates.hourly : activeRates.daily);
}

export function computeBaseAmount(baseRate = 0, qty = 0) {
  return toNumber(baseRate) * toNumber(qty);
}

export function computeTotal(baseAmount = 0, extraPayment = 0, discount = 0) {
  return toNumber(baseAmount) + toNumber(extraPayment) - toNumber(discount);
}

export function formatDateTimeLocalToApi(val) {
  if (!val) return null;
  try {
    const d = new Date(val);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;
  } catch {
    return String(val);
  }
}

