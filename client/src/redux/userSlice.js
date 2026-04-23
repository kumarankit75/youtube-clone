import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("currentUser");
const initialState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("currentUser");
    },
    // ✅ New - update user info after profile edit
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;