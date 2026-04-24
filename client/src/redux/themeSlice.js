import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: savedTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;