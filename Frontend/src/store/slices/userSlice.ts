
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ReviewResponse, User, UserLogin } from '../../types/userTypes';
import { cartResponse } from '../../types/cartType';
import { OrderResponse } from '../../types/userSide/orderType';
import { CourseDetailResponse, CourseListResponse } from '../../types/courseType';
import { RootState } from '..';


export type UserRole = 'user' | 'admin' | 'institute' | 'tutor';


interface RegisterResponse {
  userDetails: User;
  data:any;
  status: number;
  message: string;
}

const baseQueryWithRole = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    
    let role: UserRole | null = 'user';
    if (role) {
      headers.set('role', role);
    }

    return headers;
  },
  credentials: 'include',
});
export const userSlice = createApi({
  reducerPath: 'userApi', 
  baseQuery: baseQueryWithRole as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
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

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body: body,
        credentials: 'include'

      }),
      invalidatesTags: ['User'],
    }),

    cartPage: builder.query<cartResponse,null>({
      query: () =>({
        url: '/users/cart-items',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['User']
    }),

    addToCart: builder.mutation<string, { courseId: string }>({
      query: ({courseId}) =>({
        url: '/users/add-cart',
        method: 'POST',
        credentials: 'include',
        body: {courseId}
      })
    }),

    removeCart: builder.mutation<string, { courseId: string }>({
      query: ({courseId}) =>({
        url: '/users/remove-cart',
        method: 'PATCH',
        credentials: 'include',
        body: {courseId}
      })
    }),

    payment: builder.mutation({
      query: ({orderDetails}) => ({
        url: '/users/payment',
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {orderDetails}, 
      }),
    }),

    paymentSuccess: builder.mutation({
      query: (orderId) => ({
        url: '/users/payment-success',
        method: 'POST',
        credentials: 'include',
        body: {orderId}, 
      }),
    }),

    courseList: builder.query<CourseListResponse>({
      query: ({ page = 1, limit = 4, search = '', filter='all', sort='' }) => ({
        url: '/users/course-list',
        params:{ page, limit, search, filter, sort },
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['User'],
     }),

     changePassword: builder.mutation({
      query: (values) => ({
        url: '/users/change-password',
        method: 'PATCH',
        credentials: 'include',
        body: values,
      }),
      invalidatesTags: ['User'],
     }),

     getOrders: builder.query<OrderResponse , null>({
      query: () =>({
        url: '/users/order-list',
        method:'GET',
        credentials: 'include'
      }),
      providesTags: ['User'],
     }),

     coursedetail: builder.query<CourseDetailResponse, string>({
      query: (courseId) =>({
        url: `/users/course-detail/${courseId}`,
        method:'GET',
        credentials: 'include'
      }),
      providesTags: ['User'],
     }),

     myCourses: builder.query<CourseListResponse>({
      query: ({ page = 1, limit = 4, search = '' }) =>({
        url: '/users/my-courses',
        params:{ page, limit, search},
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
     }),

     courseReview: builder.mutation({
      query: (payload) => ({
        url: '/users/create-review',
        method: 'POST',
        credentials: 'include',
        body:payload
      }),
      invalidatesTags: ['User'],
    }),

    Review: builder.query<ReviewResponse>({
      query: (courseId) => ({
        url: `/users/review?courseId=${courseId}`, 
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

     quizList: builder.query({
      query: ({ page = 1, limit = 4, search = '', filter='all', sort='' }) =>({
        url: `/users/quiz-list`,
        params:{ page, limit, search, filter, sort },
        method: 'GET',
        credentials: 'include',
      }),
      providesTags:['User']
     }),

     userLogoutCall: builder.mutation<void, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    profilePhoto: builder.mutation<RegisterResponse, { body: FormData }>({
      query: (payload) => ({
        url: '/users/profile-photo',
        method: 'POST',
        credentials: 'include',
        body: payload.body
      }),
      invalidatesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
          url: '/users/profile-update', 
          method: 'PUT',
          body: data,
          credentials: 'include'
      }),
      invalidatesTags: ['User'],
  }),

  homeData: builder.query({
    query: () => ({
      url: '/users/home-data',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['User'],
   }),

   leaderBoardList: builder.query({
    query: ({ page = 1, limit = 4, search = ''}) =>({
      url: `/users/leaderBoard-list`,
      params:{ page, limit, search},
      method: 'GET',
      credentials: 'include',
    }),
    providesTags:['User']
   }),

   quizResult: builder.mutation<{message:string},{mark:string,quizId:string}>({
    query: ({mark,quizId}) =>({
      url: `/users/quiz-result`,
      method: 'POST',
      body: {mark,quizId},
      credentials: 'include',
    }),
    invalidatesTags:['User']
   }),

  }),

});

export const 
{ useInitiateSignupMutation,
   useVerifyUserMutation, 
   useResendOtpMutation, 
   useRegisterMutation, 
   useLoginMutation, 
   useUserEmailVerifyMutation,
   useUserOtpVerifyMutation,
   useForgotPasswordMutation,
   useCartPageQuery,
   useAddToCartMutation,
   useRemoveCartMutation,
   usePaymentMutation,
   usePaymentSuccessMutation,
   useCourseListQuery,
   useChangePasswordMutation,
   useGetOrdersQuery,
   useCoursedetailQuery,
   useMyCoursesQuery,
   useQuizListQuery,
   useUserLogoutCallMutation,
   useProfilePhotoMutation,
   useUpdateProfileMutation,
   useCourseReviewMutation,
   useReviewQuery,
   useHomeDataQuery,
   useLeaderBoardListQuery,
   useQuizResultMutation
  } = userSlice;

