import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './slices/authSlice';
import { userSlice } from './slices/userSlice';
import { adminSlice } from './slices/adminSlice';
import { institutionSlice } from './slices/institutionSlice';
import { tutorSlice } from './slices/tutorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [adminSlice.reducerPath]: adminSlice.reducer,
    [institutionSlice.reducerPath]: institutionSlice.reducer,
    [tutorSlice.reducerPath]: tutorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userSlice.middleware,
      adminSlice.middleware,
      institutionSlice.middleware,
      tutorSlice.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;