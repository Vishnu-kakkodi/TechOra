import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userSlice } from './slices/userSlice';
import { adminSlice } from './slices/adminSlice';
import { institutionSlice } from './slices/institutionSlice';

export const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
    [adminSlice.reducerPath]: adminSlice.reducer, 
    [institutionSlice.reducerPath]: institutionSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(userSlice.middleware, adminSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
