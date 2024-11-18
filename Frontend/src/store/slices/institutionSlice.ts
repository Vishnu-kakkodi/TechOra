import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { CourseDocument } from '../../../../Backend/src/interfaces/course.interface';
import { CourseDetailResponse } from '../../types/courseType';
import { TutorFormData } from '../../types/institutionTypes';
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
      query: (formData) => ({
        url: '/institution/register',
        method: 'POST',
        body: formData,
        credentials: 'include'
      }),
      invalidatesTags: ['Institution'],
    }),

    trackApplication: builder.mutation({
      query: ({trackID}) => ({
        url: '/institution/track-status',
        method: 'POST',
        body: {trackID}
      }),
    }),

    institutionLogin: builder.mutation({
      query: (institutionCredential) => ({
        url: '/institution/login',
        method: 'POST',
        body: institutionCredential,
        credentials: 'include'
      }),
      invalidatesTags: ['Institution'],
    }),

    createTutor: builder.mutation<InstituteDocument, {data: TutorFormData}>({
      query: ({data}) => ({
        url: `/institution/create-tutor`,
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['Institution']
    }),

    createCourse: builder.mutation<any, { body: FormData }>({
      query: ( payload ) => ({
        url: '/institution/create-course', 
        method: 'POST',
        body: payload.body
      }),
      invalidatesTags: ['Institution']
    }),

   draftCourseList: builder.query({
    query:()=>({
      url: '/institution/draft-course',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Institution'],
   }),

   createModule: builder.mutation<any, { body: FormData }>({
    query:(payload)=>({
      url: '/institution/create-module',
      method: 'POST',
      body: payload.body,
      credentials: 'include'
    }),
    invalidatesTags: ['Institution'],
   }),

   courseList: builder.query({
    query: () => ({
      url: '/institution/course-list',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Institution'],
   }),

   coursedetail: builder.query<CourseDetailResponse, string>({
    query: (courseId) =>({
      url: `/institution/course-detail/${courseId}`,
      method:'GET',
    }),
    providesTags: ['Institution'],
   }),

   tutorList: builder.query({
    query: () => ({
      url: '/institution/tutor-list',
      method: 'GET',
      credentials: 'include'
    }),
    providesTags: ['Institution'],
  }),

  addQuiz: builder.mutation<any, { body: FormData }>({
    query: (payload) => ({
      url: '/institution/create-quiz',
      method: 'POST',
      body: payload.body,
      credentials: 'include'
    }),
    invalidatesTags: ['Institution'],
  }),

  }),
});

export const {
  useEmailVerifyMutation, 
  useOtpVerifyMutation, 
  useInstitutionLoginMutation, 
  useTrackApplicationMutation,
  useVerifyInstitutionMutation, 
  useCreateTutorMutation, 
  useCreateCourseMutation,
  useDraftCourseListQuery,
  useCreateModuleMutation,
  useCourseListQuery,
  useCoursedetailQuery,
  useTutorListQuery,
  useAddQuizMutation
} = institutionSlice;
