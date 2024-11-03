import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}/api` });

export const adminSlice = createApi({
  reducerPath: 'adminApi', // Set a unique reducerPath
  baseQuery: baseQuery as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['Admin', 'User', 'Institute'],
  endpoints: (builder) => ({
    verifyAdmin: builder.mutation({
      query: (adminCredentials) => ({
        url: '/admin/verify',
        method: 'POST',
        body: adminCredentials,
      }),
      invalidatesTags: ['Admin'],
    }),

    userList: builder.query({
      query: () => ({
        url: '/admin/user-list',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    instituteList: builder.query({
      query: () => ({
        url: '/admin/institute-list',
        method: 'GET',
      }),
      providesTags: ['Institute'],
    }),
  }),
});

export const { useVerifyAdminMutation, useUserListQuery, useInstituteListQuery } = adminSlice;
