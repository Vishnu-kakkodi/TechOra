
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  status?: string;
  profilePhoto?:string;
  [key: string]: any;
}

export interface InstituteEmailInfo {
  instituteEmail?: string;
}

interface InstituteInfo {
  id?: string;
  collegeName?: string;
  instituteEmail?: string;
  totalStudents?:number;
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

const getFromStorage = (key: string) => {
  const localItem = localStorage.getItem(key);
  sessionStorage.setItem(key, localItem || ''); 
  return localItem ? JSON.parse(localItem) : null;
};

const setToStorage = (key: string, value: any) => {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
  sessionStorage.setItem(key, stringValue);
};

const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const initialState: AuthState = {
  userInfo: getFromStorage("userInfo"),
  adminInfo: getFromStorage("adminInfo"),
  institutionInfo: getFromStorage("institutionInfo"),
  institutionEmailInfo: getFromStorage("institutionEmailInfo"),
  isUserAuthenticated: !!localStorage.getItem("userInfo"),
  isAdminAuthenticated: !!localStorage.getItem("adminInfo"),
  isInstituteAuthenticated: !!localStorage.getItem("institutionInfo"),
};

interface UpdateUserFieldPayload {
  field: keyof UserInfo;
  value: any;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isUserAuthenticated = true;
      setToStorage("userInfo", action.payload);
    },
    setAdminCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.adminInfo = action.payload;
      state.isAdminAuthenticated = true;
      setToStorage("adminInfo", action.payload);
    },
    setInstituteCredentials: (state, action: PayloadAction<InstituteInfo>) => {
      state.institutionInfo = action.payload;
      state.isInstituteAuthenticated = true;
      setToStorage("institutionInfo", action.payload);
    },
    setInstituteEmailCredentials: (state, action: PayloadAction<InstituteEmailInfo>) => {
      state.institutionEmailInfo = action.payload;
      setToStorage("institutionEmailInfo", action.payload);
    },
    updateUserField: (state, action: PayloadAction<UpdateUserFieldPayload>) => {
      if (state.userInfo) {
        const { field, value } = action.payload;
        state.userInfo = {
          ...state.userInfo,
          [field]: value
        };
        setToStorage("userInfo", state.userInfo);
      }
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.isUserAuthenticated = false;
      removeFromStorage("userInfo");
    },
    adminLogout: (state) => {
      state.adminInfo = null;
      state.isAdminAuthenticated = false;
      removeFromStorage("adminInfo");
    },
    instituteLogout: (state) => {
      state.institutionInfo = null;
      state.isInstituteAuthenticated = false;
      removeFromStorage("institutionInfo");
    },
  },
});

export const {
  setCredentials,
  setAdminCredentials,
  setInstituteCredentials,
  setInstituteEmailCredentials,
  updateUserField,
  userLogout,
  adminLogout,
  instituteLogout,
} = authSlice.actions;

export default authSlice.reducer;



