import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials,AuthState,User } from "./sliceTypes";
import { AppDispatch } from '../index.ts'

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginStart(state){
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state,action:PayloadAction<AuthState['user']>){
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure(state,action:PayloadAction<string>){
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout(state){
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions;

const credentials: LoginCredentials = {     email: 'johndoe@example.com',
    password: 'password123'};
  
  export const login = (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart(credentials));
      
      const user: User = {
        id: '1234',
        name: 'johndoe',
        email: 'johndoe@example.com',
        role: 'user',
      };
  
      // const user = await loginUser(credentials); // Uncomment this to call the actual login function
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure("unknown error"));
    }
  };
  

export default authSlice.reducer;