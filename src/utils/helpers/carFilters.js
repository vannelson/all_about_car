import { getActiveCompanyId } from "../company";

export const mapCarsFiltersToApi = (filters = {}) => {
  const mapped = {};
  const normalizedAvailability = String(filters?.availability ?? "")
    .trim()
    .toLowerCase();

  if (filters?.brand) mapped.info_make = filters.brand;
  if (filters?.model) mapped.info_model = filters.model;
  if (filters?.fuel) mapped.spcs_fuelType = filters.fuel;
  if (filters?.carType) mapped.info_carType = filters.carType;
  if (filters?.transmission) mapped.spcs_transmission = filters.transmission;
  if (["yes", "available"].includes(normalizedAvailability))
    mapped.info_availabilityStatus = "available";
  if (["no", "unavailable"].includes(normalizedAvailability))
    mapped.info_availabilityStatus = "unavailable";
  if (filters?.seats && /^\d+$/.test(String(filters.seats)))
    mapped.spcs_seats = String(filters.seats);
  if (filters?.plateNumber) mapped.info_plateNumber = filters.plateNumber;
  if (filters?.vin) mapped.info_vin = filters.vin;

  const explicitCompany =
    filters?.company_id ?? filters?.companyId ?? filters?.["company.id"] ?? null;
  if (explicitCompany != null && String(explicitCompany).length > 0) {
    mapped.company_id = explicitCompany;
  } else {
    const activeCompanyId = getActiveCompanyId();
    if (activeCompanyId !== undefined && activeCompanyId !== null) {
      mapped.company_id = activeCompanyId;
    }
  }

  return mapped;
};
