import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface InstituteEmailInfo {
  instituteEmail?: string;
}

interface InstituteInfo {
  id?: string;
  collegeName?: string;
  instituteEmail?: string;
  [key: string]: any;
}

interface AuthState {
  userInfo: UserInfo | null;
  adminInfo: UserInfo | null;
  institutionInfo: InstituteInfo | null;
  institutionEmailInfo: InstituteEmailInfo;
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isInstituteAuthenticated: boolean;
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
  institutionEmailInfo: localStorage.getItem("institutionEmailInfo")
    ? JSON.parse(localStorage.getItem("institutionEmailInfo") as string)
    : null,
    isUserAuthenticated: !!localStorage.getItem("userInfo"), 
    isAdminAuthenticated: !!localStorage.getItem("adminInfo"), 
    isInstituteAuthenticated: !!localStorage.getItem("institutionInfo"), 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isUserAuthenticated = true;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setAdminCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.adminInfo = action.payload;
      state.isAdminAuthenticated = true;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    setInstituteCredentials: (state, action: PayloadAction<InstituteInfo>) => {
      state.institutionInfo = action.payload;
      state.isInstituteAuthenticated = true;
      localStorage.setItem("institutionInfo", JSON.stringify(action.payload));
    },
    setInstituteEmailCredentials: (state, action: PayloadAction<InstituteEmailInfo>) => {
      state.institutionEmailInfo = action.payload;
      localStorage.setItem("institutionEmailInfo", JSON.stringify(action.payload));
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.isUserAuthenticated = false; 
      localStorage.removeItem("userInfo");
    },
    adminLogout: (state) => {
      state.adminInfo = null;
      state.isAdminAuthenticated = false; 
      localStorage.removeItem("adminInfo");
    },
    instituteLogout: (state) => {
      state.institutionInfo = null;
      state.isInstituteAuthenticated = false; 
      localStorage.removeItem("institutionInfo");
    },
  },
});

export const { 
  setCredentials, 
  setAdminCredentials, 
  setInstituteCredentials,
  setInstituteEmailCredentials,
  userLogout, 
  adminLogout,
  instituteLogout
} = authSlice.actions;

export default authSlice.reducer;