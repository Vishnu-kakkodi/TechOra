import { CourseDocument } from "../course.type";

interface User {
    userName: string;
    email: string;
    password: string;
    phoneNumber:string;
}

export interface UserCookieData extends User {
    user: User,
    otp: string;
    timestamp: number;
}

export interface UpdatePassword{
    currentPassword:string;
    newPassword:string;
    confirmPassword:string;
}


export interface MyCourses {
    course: CourseDocument[];
  }


  export interface winnerType{
    userName: string;
    profilePhoto: string;
  }