import { INotification } from "../../type/notification.type";
import { TutorDocument } from "../../type/tutor.type";
import { IUserDocument } from "../../type/user.type";



export interface ITutorService{
    tutorLogin(tutorEmail: string, password: string): Promise<TutorDocument | null>
    uploadPhoto(tutorId: string, fileLocation:string): Promise<TutorDocument | null>
    updateProfile(userId: string, updateData: {tutorname?: string;education?: string;experiance?: string;}): Promise<TutorDocument | null>
    enrolledStudents(tutorId: string,page: number,limit: number,search: string): Promise<{ users: IUserDocument[]; total: number }>
    recentActivity(tutorId: string): Promise<INotification[] | null>
}