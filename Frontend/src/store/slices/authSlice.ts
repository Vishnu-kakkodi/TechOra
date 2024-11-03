import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userInfo: Record<string, any> | null;
  adminInfo: Record<string, any> | null;
  institutionInfo: Record<string, any> | null;
}

const initialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo") as string)
    : null,
  institutionInfo: localStorage.getItem("institutionInfo")
    ? JSON.parse(localStorage.getItem("institutionInfo") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Record<string, any>>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setAdminCredentials: (state, action: PayloadAction<Record<string, any>>) => {
      state.adminInfo = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    setInstituteCredentials: (state, action: PayloadAction<Record<string, any>>) => {
      state.institutionInfo = action.payload;
      localStorage.setItem("institutionInfo", JSON.stringify(action.payload));
    },
  },
});

export const { setCredentials, setAdminCredentials, setInstituteCredentials } = authSlice.actions;

export default authSlice.reducer;