import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCarApi } from "../services/cars";

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
      const companyId = user?.id || user?.company_id || envCompanyId;
      const fields = {
        company_id: 5,
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
    lastCreated: null,
    error: null,
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
      });
  },
});

export default carsSlice.reducer;
