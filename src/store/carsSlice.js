import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCarApi, listCarsApi, mapCarToViewModel, updateCarApi } from "../services/cars";

export const createCar = createAsyncThunk(
  "cars/createCar",
  async (
    { formData, features, user, profileImage, displayImages },
    { rejectWithValue }
  ) => {
    try {
      const envCompanyId = import.meta?.env?.VITE_COMPANY_ID
        ? Number(import.meta.env.VITE_COMPANY_ID)
        : undefined;
      const companyId =
        user?.active_company?.id ??
        user?.company_id ??
        user?.companyId ??
        envCompanyId ??
        null;
      const fields = {
        company_id: companyId ?? null,
        info_make: formData.info_make,
        info_model: formData.info_model,
        info_year: formData.info_year,
        info_age: formData.info_age,
        info_carType: formData.info_carType,
        info_plateNumber: formData.info_plateNumber,
        info_vin: formData.info_vin,
        info_availabilityStatus: String(
          formData.info_availabilityStatus || "available"
        ).toLowerCase(),
        info_location: formData.info_location,
        info_mileage: formData.info_mileage,
        spcs_seats: formData.spcs_seats,
        spcs_largeBags: formData.spcs_largeBags,
        spcs_smallBags: formData.spcs_smallBags,
        spcs_engineSize: formData.spcs_engineSize,
        spcs_transmission: formData.spcs_transmission,
        spcs_fuelType: formData.spcs_fuelType,
        spcs_fuelEfficiency: formData.spcs_fuelEfficiency,
      };
      const res = await createCarApi({
        fields,
        features: features || [],
        profileImage,
        displayImages,
        companyId,
      });
      // Rates are now created via a separate modal (not during car creation)
      return res;
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState: {
    creating: false,
    updating: false,
    lastCreated: null,
    lastUpdated: null,
    error: null,
    // Listing state
    listLoading: false,
    listError: null,
    items: [],
    page: 1,
    limit: 10,
    hasNext: false,
    meta: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCar.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.creating = false;
        state.lastCreated = action.payload;
      })
      .addCase(createCar.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || { message: "Failed to create car" };
      })
      .addCase(updateCar.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.updating = false;
        state.lastUpdated = action.payload;
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || { message: "Failed to update car" };
      })
      // fetch cars list
      .addCase(fetchCars.pending, (state, action) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.listLoading = false;
        const { items, page, limit, meta } = action.payload;
        state.items = items;
        state.page = page;
        state.limit = limit;
        state.meta = meta || null;
        if (meta?.last_page) {
          state.hasNext = (meta.current_page || 1) < meta.last_page;
        } else {
          state.hasNext = items.length >= limit; // fallback
        }
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || { message: "Failed to load cars" };
      });
  },
});

export default carsSlice.reducer;

// Thunks
export const fetchCars = createAsyncThunk(
  "cars/fetchList",
  async ({ page = 1, limit = 10, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const res = await listCarsApi({ page, limit, includes: ["rates", "company", "next_available_window"], filters });
      const raw = res?.data || [];
      const items = raw.map((c) => mapCarToViewModel(c)).filter(Boolean);
      const meta = res?.meta || null;
      return { items, page: meta?.current_page || page, limit: meta?.per_page || limit, meta };
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (
    { id, formData, features, user, profileImage, displayImages },
    { rejectWithValue }
  ) => {
    try {
      const envCompanyId = import.meta?.env?.VITE_COMPANY_ID
        ? Number(import.meta.env.VITE_COMPANY_ID)
        : undefined;
      const companyId =
        user?.active_company?.id ??
        user?.company_id ??
        user?.companyId ??
        envCompanyId ??
        null;
      const fields = {
        company_id: companyId ?? null,
        info_make: formData.info_make,
        info_model: formData.info_model,
        info_year: formData.info_year,
        info_age: formData.info_age,
        info_carType: formData.info_carType,
        info_plateNumber: formData.info_plateNumber,
        info_vin: formData.info_vin,
        info_availabilityStatus: String(
          formData.info_availabilityStatus || "available"
        ).toLowerCase(),
        info_location: formData.info_location,
        info_mileage: formData.info_mileage,
        spcs_seats: formData.spcs_seats,
        spcs_largeBags: formData.spcs_largeBags,
        spcs_smallBags: formData.spcs_smallBags,
        spcs_engineSize: formData.spcs_engineSize,
        spcs_transmission: formData.spcs_transmission,
        spcs_fuelType: formData.spcs_fuelType,
        spcs_fuelEfficiency: formData.spcs_fuelEfficiency,
      };
      const res = await updateCarApi({
        id,
        fields,
        features: features || [],
        profileImage,
        displayImages,
        companyId,
      });
      return res;
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);
