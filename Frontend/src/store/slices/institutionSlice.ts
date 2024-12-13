import { createApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { InstituteDocument } from '../../../../Backend/src/interfaces/institute.interface';
import { CourseDetailResponse } from '../../types/courseType';
import { TutorFormData } from '../../types/institutionTypes';
import { UserRole } from './userSlice';

const baseQueryWithRole = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  prepareHeaders: (headers, { getState }) => {
    
    let role: UserRole | null = 'institute';

    if (role) {
      headers.set('role', role);
    }

    return headers;
  },
  credentials: 'include',
});
export const institutionSlice = createApi({
  reducerPath: 'instituteApi',
  baseQuery: baseQueryWithRole as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
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
    query: ({ page = 1, limit = 4, search = '', filter='all', sort='' }) => ({
      url: '/institution/course-list',
      params:{ page, limit, search, filter, sort },
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

  addQuiz: builder.mutation({
    query: (quizPayload) => ({
      url: '/institution/create-quiz',
      method: 'POST',
      body: quizPayload,
      credentials: 'include'
    }),
    invalidatesTags: ['Institution'],
  }),

  instituteLogoutCall: builder.mutation<void, void>({
    query: () => ({
      url: '/institution/logout',
      method: 'POST',
      credentials: 'include',
    }),
    invalidatesTags: ['Institution'],
  }),

  quizList: builder.query({
    query: ({ page = 1, limit = 4, search = '', filter='all', sort='', selectedStatus='' }) =>({
      url: `/institution/quiz-list`,
      params:{ page, limit, search, filter, sort, selectedStatus },
      method: 'GET',
      credentials: 'include',
    }),
    providesTags:['Institution']
   }),

   quizDetail: builder.query({
    query: (quizId) =>({
      url: `/institution/quiz-detail/?quizId=${quizId}`,
      method: 'GET',
      credentials: 'include',
    }),
    providesTags:['Institution']
   }),

   updateQuiz: builder.mutation<any, {quizPayload:any, quizId:string|undefined}>({
    query: ({quizPayload,quizId}) => ({
        url: `/institution/quiz-update/?quizId=${quizId}`, 
        method: 'POST',
        body: quizPayload,
        credentials: 'include'  
    }),
    invalidatesTags: ['Institution'],
}),

   listCourse: builder.mutation<string, { courseId: string }>({
    query: ({courseId}) => ({
      url: '/institution/list-course',
      method: 'PATCH',
      body:{courseId},
      credentials: 'include'
    }),
    invalidatesTags: ['Institution'],
  }),

  updateCourse: builder.mutation<any, {values:any, id:string|undefined}>({
    query: ({values,id}) => ({
        url: `/institution/course-update/?courseId=${id}`, 
        method: 'POST',
        body: values,
        credentials: 'include'  
    }),
    invalidatesTags: ['Institution'],
}),

moduleDelete: builder.mutation<any, {moduleId:any, courseId:string}>({
  query: ({moduleId,courseId}) => ({
      url: `/institution/module-delete/?courseId=${courseId}&moduleId=${moduleId}`,
      method: 'DELETE',
      credentials: 'include'  
  }),
  invalidatesTags: ['Institution'],
}),

chartData: builder.query({
  query: () => ({
    url: '/institution/chart-data',
    method: 'GET',
    credentials: 'include'
  }),
  providesTags: ['Institution'],
 }),


 addDepartment: builder.mutation({
  query: ({department}) => ({
      url: `/institution/add-department`,
      method: 'POST',
      body:{department},
      credentials: 'include'  
  }),
  invalidatesTags: ['Institution'],
}),

getDepartment: builder.query({
  query: ({ page = 1, limit = 4, search = '' }) => ({
      url: `/institution/department-list`,
      params:{ page, limit, search},
      method: 'GET',
      credentials: 'include'  
  }),
  providesTags: ['Institution'],
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
  useAddQuizMutation,
  useInstituteLogoutCallMutation,
  useQuizListQuery,
  useQuizDetailQuery,
  useUpdateQuizMutation,
  useListCourseMutation,
  useUpdateCourseMutation,
  useModuleDeleteMutation,
  useChartDataQuery,
  useAddDepartmentMutation,
  useGetDepartmentQuery
} = institutionSlice;
