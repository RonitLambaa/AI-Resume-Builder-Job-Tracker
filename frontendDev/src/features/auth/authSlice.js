import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: false, // true if logged in
  loading: true, // true while checking /me
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.status = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.status = false;
      state.loading = false;

      // Clear all stored auth info
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;


