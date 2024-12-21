import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { IUserDocument } from '../../../../Backend/src/interfaces/user.interface';
import { UserRole } from './userSlice';
import { InstituteViewQueryResponse } from '../../types/userTypes';
import { InstituteDocument } from '../../types/Institute/InstituteDocument';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseQueryWithRole = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  prepareHeaders: (headers, { getState }) => {

    let role: UserRole | null = 'admin';

    if (role) {
      headers.set('role', role);
    }

    return headers;
  },
  credentials: 'include',
});
export const adminSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithRole as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
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

    userList: builder.query<{
      users: IUserDocument[],
      total: number
    },
      {
        page?: number,
        limit?: number,
        search?: string,
        filter?: string
      }
    >({
      query: ({ page = 1, limit = 4, search = '', filter = 'all' }) => ({
        url: '/admin/user-list',
        params: { page, limit, search, filter }
      }),
      providesTags: ['User']
    }),


    instituteList: builder.query<{
      institutes: InstituteDocument[],
      total: number
    },
      {
        page?: number,
        limit?: number,
        search?: string,
        filter?: string
      }
    >({
      query: ({ page = 1, limit = 4, search = '', filter = 'all' }) => ({
        url: '/admin/institute-list',
        params: { page, limit, search, filter }
      }),
      providesTags: ['Institute']
    }),


    userAction: builder.mutation<InstituteViewQueryResponse, { userId: string }>({
      query: (userId) => ({
        url: `/admin/user-action/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),

    instituteView: builder.query<InstituteDocument, { instituteId: string | undefined }>({
      query: ({ instituteId }) => ({
        url: `/admin/institute-view/?id=${instituteId}`,
        method: 'GET'
      })
    }),

    instituteApprove: builder.mutation<InstituteDocument, { instituteId: string }>({
      query: (instituteId) => ({
        url: `/admin/institute-approve/?id=${instituteId}`,
        method: 'PATCH'
      })
    }),

    instituteReject: builder.mutation<InstituteDocument, { instituteId: string, rejectReason: string }>({
      query: ({ instituteId, rejectReason }) => ({
        url: `/admin/institute-reject/?id=${instituteId}`,
        method: 'PATCH',
        body: {
          rejectReason: rejectReason
        }
      })
    }),

    instituteBlock: builder.mutation<InstituteDocument, { instituteId: string }>({
      query: (instituteId) => ({
        url: `/admin/institute-block/?id=${instituteId}`,
        method: 'PATCH'
      })
    }),

    instituteUnBlock: builder.mutation<InstituteDocument, { instituteId: string }>({
      query: (instituteId) => ({
        url: `/admin/institute-unblock/?id=${instituteId}`,
        method: 'PATCH'
      })
    }),

    documentDownload: builder.mutation({
      query: (url) => ({
        url: `/admin/download-document?url=${encodeURIComponent(url)}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      })
    }),

    adminLogoutCall: builder.mutation<void, void>({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const
  { useVerifyAdminMutation,
    useUserListQuery,
    useInstituteListQuery,
    useUserActionMutation,
    useInstituteViewQuery,
    useInstituteApproveMutation,
    useDocumentDownloadMutation,
    useInstituteRejectMutation,
    useInstituteBlockMutation,
    useInstituteUnBlockMutation,
    useAdminLogoutCallMutation
  } = adminSlice;
