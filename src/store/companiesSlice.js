import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listCompaniesApi,
  createCompanyApi,
  updateCompanyApi,
  toggleDefaultCompanyApi,
} from "../services/companies";

export const fetchCompanies = createAsyncThunk(
  "companies/fetchList",
  async ({ page = 1, limit = 10, filters = {}, order = [] } = {}, { rejectWithValue }) => {
    try {
      const res = await listCompaniesApi({ page, limit, filters, order });
      return {
        items: Array.isArray(res.items) ? res.items : [],
        page: res.meta?.current_page || page,
        limit: res.meta?.per_page || limit,
        total: res.meta?.total ?? res.items?.length ?? 0,
        meta: res.meta || null,
        links: res.links || null,
        raw: res.raw,
      };
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

export const createCompany = createAsyncThunk(
  "companies/create",
  async ({ user_id, name, address, industry, is_default = false, logo = null }, { rejectWithValue }) => {
    try {
      const res = await createCompanyApi({
        user_id,
        name,
        address,
        industry,
        is_default,
        logo,
      });
      return res?.data;
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

export const updateCompany = createAsyncThunk(
  "companies/update",
  async ({ id, name, address, industry, is_default }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (name !== undefined) payload.name = name;
      if (address !== undefined) payload.address = address;
      if (industry !== undefined) payload.industry = industry;
      if (is_default !== undefined) payload.is_default = is_default;

      const res = await updateCompanyApi(id, payload);
      return { id, payload, res };
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

export const setDefaultCompany = createAsyncThunk(
  "companies/setDefault",
  async ({ id, is_default }, { rejectWithValue }) => {
    try {
      const res = await toggleDefaultCompanyApi(id, is_default);
      return { id, is_default, res };
    } catch (err) {
      return rejectWithValue(err?.data || { message: err.message });
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    loading: false,
    error: null,
    creating: false,
    createError: null,
    updating: false,
    updateError: null,
    togglingDefault: false,
    toggleError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Failed to fetch companies" };
      })
      .addCase(createCompany.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.creating = false;
        const company = action.payload;
        if (company) {
          if (company.is_default) {
            state.items = state.items.map((item) => ({ ...item, is_default: false }));
          }
          state.items = [company, ...state.items];
          state.total += 1;
        }
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || { message: "Failed to create company" };
      })
      .addCase(updateCompany.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updating = false;
        const { id, payload } = action.payload || {};
        if (id) {
          state.items = state.items.map((item) =>
            item.id === id ? { ...item, ...payload } : item
          );
          if (payload?.is_default) {
            state.items = state.items.map((item) =>
              item.id === id ? item : { ...item, is_default: false }
            );
          }
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || { message: "Failed to update company" };
      })
      .addCase(setDefaultCompany.pending, (state) => {
        state.togglingDefault = true;
        state.toggleError = null;
      })
      .addCase(setDefaultCompany.fulfilled, (state, action) => {
        state.togglingDefault = false;
        const { id, is_default } = action.payload || {};
        if (id) {
          state.items = state.items.map((item) =>
            item.id === id ? { ...item, is_default } : { ...item, is_default: false }
          );
        }
      })
      .addCase(setDefaultCompany.rejected, (state, action) => {
        state.togglingDefault = false;
        state.toggleError = action.payload || { message: "Failed to toggle default company" };
      });
  },
});

export default companiesSlice.reducer;
