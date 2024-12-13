
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { userSlice } from './slices/userSlice';
import { adminSlice } from './slices/adminSlice';
import { institutionSlice } from './slices/institutionSlice';
import { tutorSlice } from './slices/tutorSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  [userSlice.reducerPath]: userSlice.reducer,
  [adminSlice.reducerPath]: adminSlice.reducer,
  [institutionSlice.reducerPath]: institutionSlice.reducer,
  [tutorSlice.reducerPath]: tutorSlice.reducer,
});

export default rootReducer; 