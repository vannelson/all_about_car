/**
 * Extracts key-value pairs from a booking object.
 *
 * @param {Object} booking
 * @param {Array|string} params
 * @returns {Array<{key: string, value: string}>}
 */
export function extractBookingDetails(booking, params) {
  if (!booking) return [];
  const keys = params === "all" ? Object.keys(booking) : params;

  return keys.map((key) => {
    if (!booking) return { key, value: "" };
    if (key.includes("_")) {
      const parts = key.split("_");
      const combined = parts
        .map((p) => booking[p])
        .filter(Boolean)
        .join(" - ");
      return { key, value: combined };
    }

    return { key, value: booking[key] || "" };
  });
}
