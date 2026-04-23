// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   currentUser: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.loading = true;
//     },
//     loginSuccess: (state, action) => {
//       state.loading = false;
//       state.currentUser = action.payload;
//       state.error = null;
//     },
//     loginFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     logout: (state) => {
//       state.currentUser = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
// export default userSlice.reducer;






import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if exists
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
      // Save to localStorage
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
      // Clear localStorage
      localStorage.removeItem("currentUser");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;