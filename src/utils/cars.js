// Utility helpers for car view-models

// Extract the numeric ID from various car shapes (VM or raw API)
export function getCarIdFromCard(car) {
  if (!car || typeof car !== "object") return null;
  if (car.id != null) return Number(car.id) || null;
  if (car.raw && car.raw.id != null) return Number(car.raw.id) || null;
  return null;
}

