import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null, // full user payload from API (includes active_company, etc.)
  role: null, // 'tenant' | 'borrower' (derived from user.type)
  token: null,
  profile: null, // raw API response payload (optional)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, role, token, profile } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token || null;
      state.profile = profile || null;
    },
    registerSuccess: (state, action) => {
      const { user, role, token, profile } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token || null;
      state.profile = profile || null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
      state.profile = null;
    },
  },
});

export const { loginSuccess, registerSuccess, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
