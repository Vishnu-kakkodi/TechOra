import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { CourseDetailResponse } from '../../types/courseType';
import { TutorFormData } from '../../types/institutionTypes';
import { UserRole } from './userSlice';

const baseQueryWithRole = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  prepareHeaders: (headers, { getState }) => {
    
    let role: UserRole | null = 'tutor';

    if (role) {
      headers.set('role', role);
    }

    return headers;
  },
  credentials: 'include',
});
export const tutorSlice = createApi({
  reducerPath: 'tutorApi',
  baseQuery: baseQueryWithRole as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['Admin', 'User', 'Institution', 'Tutor'],
  endpoints: (builder) => ({

    otpVerify: builder.mutation({
      query: (data: { otp: string }) => ({
        url: '/tutor/verify-Otp',
        method: 'POST',
        body: data,
        credentials: 'include'

      }),
      invalidatesTags: ['Tutor'],
    }),

    tutorLogin: builder.mutation({
      query: (tutorCredential) => ({
        url: '/tutor/login',
        method: 'POST',
        body: tutorCredential,
        credentials: 'include'
      }),
      invalidatesTags: ['Tutor'],
    }),

    createCourse: builder.mutation<any, { body: FormData }>({
      query: ( payload ) => ({
        url: '/tutor/create-course', 
        method: 'POST',
        body: payload.body
      }),
      invalidatesTags: ['Tutor']
    }),

   draftCourseList: builder.query({
    query:()=>({
      url: '/tutor/draft-course',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Tutor'],
   }),

   createModule: builder.mutation<any, { body: FormData }>({
    query:(payload)=>({
      url: '/tutor/create-module',
      method: 'POST',
      body: payload.body,
      credentials: 'include'
    }),
    invalidatesTags: ['Tutor'],
   }),

   courseList: builder.query({
    query: ({ page = 1, limit = 4, search = '', filter='all', sort='' }) => ({
      url: '/tutor/course-list',
      params:{ page, limit, search, filter, sort },
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Tutor'],
   }),

   coursedetail: builder.query<CourseDetailResponse, string>({
    query: (courseId) =>({
      url: `/tutor/course-detail/${courseId}`,
      method:'GET',
    }),
    providesTags: ['Tutor'],
   }),

   tutorList: builder.query({
    query: () => ({
      url: '/tutor/tutor-list',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Tutor'],
  }),

  addQuiz: builder.mutation({
    query: (quizPayload) => ({
      url: '/tutor/create-quiz',
      method: 'POST',
      body: quizPayload,
      credentials: 'include'
    }),
    invalidatesTags: ['Tutor'],
  }),

  tutorLogoutCall: builder.mutation<void, void>({
    query: () => ({
      url: '/tutor/logout',
      method: 'POST',
      credentials: 'include',
    }),
    invalidatesTags: ['Tutor'],
  }),

  quizList: builder.query({
    query: ({ page = 1, limit = 4, search = '', filter='all', sort='', selectedStatus='' }) =>({
      url: `/tutor/quiz-list`,
      params:{ page, limit, search, filter, sort, selectedStatus },
      method: 'GET',
      credentials: 'include',
    }),
    providesTags:['Tutor']
   }),

   quizDetail: builder.query({
    query: (quizId) =>({
      url: `/tutor/quiz-detail/?quizId=${quizId}`,
      method: 'GET',
      credentials: 'include',
    }),
    providesTags:['Tutor']
   }),

   updateQuiz: builder.mutation<any, {quizPayload:any, quizId:string|undefined}>({
    query: ({quizPayload,quizId}) => ({
        url: `/tutor/quiz-update/?quizId=${quizId}`, 
        method: 'POST',
        body: quizPayload,
        credentials: 'include'  
    }),
    invalidatesTags: ['Tutor'],
}),

   listCourse: builder.mutation<string, { courseId: string }>({
    query: ({courseId}) => ({
      url: '/tutor/list-course',
      method: 'PATCH',
      body:{courseId},
      credentials: 'include'
    }),
    invalidatesTags: ['Tutor'],
  }),

  updateCourse: builder.mutation<any, {values:any, id:string|undefined}>({
    query: ({values,id}) => ({
        url: `/tutor/course-update/?courseId=${id}`, 
        method: 'POST',
        body: values,
        credentials: 'include'  
    }),
    invalidatesTags: ['Tutor'],
}),

moduleDelete: builder.mutation<any, {moduleId:any, courseId:string}>({
  query: ({moduleId,courseId}) => ({
      url: `/tutor/module-delete/?courseId=${courseId}&moduleId=${moduleId}`,
      method: 'DELETE',
      credentials: 'include'  
  }),
  invalidatesTags: ['Tutor'],
}),

chartData: builder.query({
  query: () => ({
    url: '/tutor/chart-data',
    method: 'GET',
    credentials: 'include'
  }),
  providesTags: ['Tutor'],
 }),

 uploadPhoto: builder.mutation<any,{ body: FormData }>({
  query: (payload) =>({
    url: '/tutor/update-photo',
    method: 'POST',
    body: payload.body,
    credentials: 'include'
  }),
  invalidatesTags: ['Tutor'],
 }),

 updateProfile: builder.mutation({
  query: (data) => ({
      url: '/tutor/profile-update', 
      method: 'PUT',
      body: data,
      credentials: 'include'
  }),
  invalidatesTags: ['User'],
}),



  }),
});

export const {
  useOtpVerifyMutation, 
  useTutorLoginMutation,
  useCreateCourseMutation,
  useDraftCourseListQuery,
  useCreateModuleMutation,
  useCourseListQuery,
  useCoursedetailQuery,
  useTutorListQuery,
  useAddQuizMutation,
  useTutorLogoutCallMutation,
  useQuizListQuery,
  useQuizDetailQuery,
  useUpdateQuizMutation,
  useListCourseMutation,
  useUpdateCourseMutation,
  useModuleDeleteMutation,
  useChartDataQuery,
  useUploadPhotoMutation,
  useUpdateProfileMutation
} = tutorSlice;
