import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}/api` });

export const institutionSlice = createApi({
  baseQuery: baseQuery as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['Admin', 'User', 'Institution'],
  endpoints: (builder) => ({

    emailVerify: builder.mutation({
      query: (institutionCredential) => ({
        url: '/institution/verify-email',
        method: 'POST',
        body: institutionCredential,
        credentials: 'include',
      }),
      invalidatesTags: ['Institution'],
    }),

    otpVerify: builder.mutation({
      query: (data: { otp: string }) => ({
        url: '/institution/verify-Otp',
        method: 'POST',
        body: data,
        credentials: 'include'

      }),
      invalidatesTags: ['Institution'],
    }),

    verifyInstitution: builder.mutation({
      query: (institutionCredential) => ({
        url: '/institution/register',
        method: 'POST',
        body: institutionCredential,
      }),
      invalidatesTags: ['Institution'],
    }),

    institutionLogin: builder.mutation({
      query: (institutionCredential) => ({
        url: '/institution/login',
        method: 'POST',
        body: institutionCredential,
      }),
      invalidatesTags: ['Institution'],
    })
  }),
});

export const {useEmailVerifyMutation , useOtpVerifyMutation, useInstitutionLoginMutation, useVerifyInstitutionMutation } = institutionSlice;
