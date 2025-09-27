import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null, // { name, email }
  role: null, // 'tenant' | 'borrower' (derived from user.type)
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, role, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token || null;
    },
    registerSuccess: (state, action) => {
      const { user, role, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token || null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, registerSuccess, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
