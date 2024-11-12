// import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query';
// import { User, UserLogin } from '../../types/userTypes';
// import { userApiServices } from '../../services/userApiService';

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// interface RegisterResponse{
//     user: User;
//     message: string;
// }

// const baseQuery = fetchBaseQuery({baseUrl: `${backendUrl}/api/`});

// export  const userSlice = createApi({
//     baseQuery:baseQuery as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
//     tagTypes: ['User'],
//     endpoints: (builder) =>({

//         register:builder.mutation<RegisterResponse, Partial<User>>({
//             query: (data) =>({
//                     url: 'users/register',
//                     method: "POST",
//                     body: data
//             }),

//             transformResponse: (response: RegisterResponse)=>{
//                 console.log("Transform response:",response);
//                 return response;
//             },
//             transformErrorResponse: (error: FetchBaseQueryError) => {
//                 console.log('Transform Error:', error);
//                 return error;
//               },
//             invalidatesTags: [{ type: 'User' }],
//         }),
//         login:builder.mutation<RegisterResponse, Partial<UserLogin>>({
//             query: (data) =>({
//                     url: 'users/login',
//                     method: "POST",
//                     body: data
//             }),

//             transformResponse: (response: RegisterResponse)=>{
//                 console.log("Transform response:",response);
//                 return response;
//             },
//             transformErrorResponse: (error: FetchBaseQueryError) => {
//                 console.log('Transform Error:', error);
//                 return error;
//               },
//             invalidatesTags: [{ type: 'User' }],
//         })
//     }),
// });

// export const {useRegisterMutation,useLoginMutation} = userSlice;


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { User, UserLogin } from '../../types/userTypes';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface RegisterResponse {
  user: User;
  message: string;
}

const baseQuery = fetchBaseQuery({ baseUrl: `${backendUrl}/api/` });

export const userSlice = createApi({
  reducerPath: 'userApi', 
  baseQuery: baseQuery as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    initiateSignup: builder.mutation<RegisterResponse, Partial<User>>({
      query: (data) => ({
        url: 'users/initiate-register',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),

    verifyUser: builder.mutation({
      query: (data: { otp: string }) => ({
        url: 'users/verify-user',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },

    }),

    resendOtp: builder.mutation<void, void>({
      query: () => ({
        url: 'users/resend-otp',
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: [{ type: 'User' }],
    }),
    

    register: builder.mutation<RegisterResponse, Partial<User>>({
      query: (data) => ({
        url: 'users/register',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),
    login: builder.mutation<RegisterResponse, Partial<UserLogin>>({
      query: (data) => ({
        url: 'users/login',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),

    userEmailVerify: builder.mutation({
      query: (data) => ({
        url: 'users/verify-email',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'User' }],
    }),

    userOtpVerify: builder.mutation({
      query: (data: { otp: string }) => ({
        url: '/users/verify-Otp',
        method: 'POST',
        body: data,
        credentials: 'include'

      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useInitiateSignupMutation, useVerifyUserMutation, useResendOtpMutation, useRegisterMutation, useLoginMutation, useUserEmailVerifyMutation, useUserOtpVerifyMutation } = userSlice;

