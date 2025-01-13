import { CourseDocument } from "../../type/course.type"
import { IUserDocument } from "../../type/user.type"
import { CreateUserDto } from "../../dtos/user.dtos"
import { UpdatePassword, UserCookieData } from "../../type/types/user.types"
import { userDetail } from "../../services/user.service"



export interface IUserService{
    initiateUser(userDetail: CreateUserDto): Promise<userDetail>
    createUser(cookieData: UserCookieData, OTP: string): Promise<IUserDocument>
    getUser(email: string, password: string): Promise<IUserDocument | null>
    googleSign(email: string, userName: string, phoneNumber: string): Promise<any | null>
    verifyEmail(email: string): Promise<string>
    verifyOtp(otp: string, CookieData: string): Promise<string | undefined> 
    forgotPassword(email: string, password: string): Promise<IUserDocument | null>
    resendOtp(email: string): Promise<string>
    changePassword(credential:UpdatePassword, userId:string): Promise<void>
    myCourses(userId:string,page:number,limit:number,search:string): Promise<{ course: CourseDocument[] | null; total: number;}>
    profilePhoto(userId:string, fileLocation:string): Promise<IUserDocument | null>
    updateProfile(userId: string, updateData: {userName?: string;phoneNumber?: string;address?: string;}): Promise<IUserDocument | null>
    homeData(): Promise<{course:CourseDocument[] | null}>
    quizWinners(): Promise<{ quizWinners: IUserDocument[] | null; }>
    leaderBoard(page:number,limit:number,search:string,userId:string): Promise<{ users: IUserDocument[] | null; total: number; currentUser: IUserDocument|null}>
}