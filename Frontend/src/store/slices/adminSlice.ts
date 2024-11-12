import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { IUserDocument } from '../../../../Backend/src/interfaces/user.interface';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { string } from 'yup';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}/api` });

export const adminSlice = createApi({
  reducerPath: 'adminApi', 
  baseQuery: baseQuery as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['Admin', 'User', 'Institute'],
  endpoints: (builder) => ({
    verifyAdmin: builder.mutation({
      query: (adminCredentials) => ({
        url: '/admin/verify',
        method: 'POST',
        body: adminCredentials,
        credentials: 'include'
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

    userAction: builder.mutation<IUserDocument, { userId: string }>({
      query: (userId) => ({
        url: `/admin/user-action/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),

    instituteView: builder.mutation<InstituteDocument, {instituteId: string}>({
      query: (instituteId) => ({
        url: `/admin/institute-view/?id=${instituteId}`,
        method: 'GET'
      })
    }),

    instituteApprove: builder.mutation<InstituteDocument, {instituteId: string}>({
      query: (instituteId) => ({
        url: `/admin/institute-action/?id=${instituteId}`,
        method: 'PATCH'
      })
    })
  }),
});

export const { useVerifyAdminMutation, useUserListQuery, useInstituteListQuery, useUserActionMutation, useInstituteViewMutation, useInstituteApproveMutation } = adminSlice;
