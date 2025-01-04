import { DownloadDocResponse } from "../../controllers/admin.controller";
import { AdminResponse } from "../../type/admin.type";
import { InstituteDocument } from "../../type/institute.type";
import { IUserDocument } from "../../type/user.type";



export interface IAdminService{
    verifyAdminCredentials(adminEmail: string, adminPassword: string): Promise<AdminResponse>
    getUser(page:number,limit:number,search:string,status:string): Promise<{ users: IUserDocument[]; total: number }>
    getInstitutes(page:number,limit:number,search:string,filter:string): Promise<{ institutes: InstituteDocument[]; total: number }>
    userAction(userId: string): Promise<IUserDocument>
    InstituteAction(instituteId: string): Promise<InstituteDocument>
    InstituteReject(instituteId: string, rejectReason:string): Promise<InstituteDocument>
    InstituteBlock(instituteId: string): Promise<InstituteDocument>
    InstituteUnBlock(instituteId: string): Promise<InstituteDocument>
    InstituteView(instituteId: string): Promise<InstituteDocument>
    downloadDoc(url: string): Promise<DownloadDocResponse>
}