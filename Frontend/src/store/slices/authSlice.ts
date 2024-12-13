
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


interface TutorInfo {
  id?: string;
  tutorEmail?: string;
  tutorname?: string;
  education?: string;
  experiance?: string;
  institutionId?: {
    _id:string;
    collegeName:string;
  }
  gender?:string;
  isAdmin?:string;
  profilePic?:string;
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
  tutorInfo: TutorInfo | null;
  institutionEmailInfo: InstituteEmailInfo;
  isUserAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isInstituteAuthenticated: boolean;
  isTutorAuthenticated: boolean;
}

const getFromStorage = (key: string) => {
  const localItem = localStorage.getItem(key);
  return localItem ? JSON.parse(localItem) : null;
};

const setToStorage = (key: string, value: any) => {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
};

const removeFromStorage = (key: string) => {
  localStorage.removeItem(key);
};

const initialState: AuthState = {
  userInfo: getFromStorage("userInfo"),
  adminInfo: getFromStorage("adminInfo"),
  institutionInfo: getFromStorage("institutionInfo"),
  tutorInfo: getFromStorage("tutorInfo"),
  institutionEmailInfo: getFromStorage("institutionEmailInfo"),
  isUserAuthenticated: !!localStorage.getItem("userInfo"),
  isAdminAuthenticated: !!localStorage.getItem("adminInfo"),
  isInstituteAuthenticated: !!localStorage.getItem("institutionInfo"),
  isTutorAuthenticated: !!localStorage.getItem("tutorInfo")
};

interface UpdateUserFieldPayload {
  field: keyof UserInfo;
  value: any;
}

interface UpdateTutorFieldPayload {
  field: keyof TutorInfo;
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
    setTutorCredential: (state, action: PayloadAction<TutorInfo>) => {
      state.tutorInfo = action.payload;
      state.isTutorAuthenticated = true;
      setToStorage("tutorInfo", action.payload);
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

    updateTutorField: (state, action: PayloadAction<UpdateTutorFieldPayload>) => {
      if (state.tutorInfo) {
        const { field, value } = action.payload;
        state.tutorInfo = {
          ...state.tutorInfo,
          [field]: value
        };
        setToStorage("tutorInfo", state.tutorInfo);
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
    tutorLogout: (state) => {
      state.tutorInfo = null;
      state.isTutorAuthenticated = false;
      removeFromStorage("tutorInfo");
    },
  },
});

export const {
  setCredentials,
  setAdminCredentials,
  setInstituteCredentials,
  setTutorCredential,
  setInstituteEmailCredentials,
  updateUserField,
  userLogout,
  adminLogout,
  instituteLogout,
  tutorLogout,
  updateTutorField
} = authSlice.actions;

export default authSlice.reducer;



