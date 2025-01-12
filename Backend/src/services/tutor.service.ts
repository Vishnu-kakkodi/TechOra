import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorDocument } from "../type/tutor.type";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IUserDocument } from "../type/user.type";
import { UserRepository } from "../repositories/user.repository";
import mongoose from "mongoose";
import { NotificationRepository } from "../repositories/notification.repository";
import { INotification } from "../type/notification.type";
import { ITutorService } from "../interfaces/IServiceInterface/ITutorService";
import { ITutorRepository } from "../interfaces/IRepositoryInterface/ITutorRepository";
import { IUserRepository } from "../interfaces/IRepositoryInterface/IUserRepository";
import { INotificationRepository } from "../interfaces/IRepositoryInterface/INotificationRepository";

class TutorService implements ITutorService {
    private tutorRepository: ITutorRepository;
    private userRepository: IUserRepository;
    private notificationRepository: INotificationRepository;

    constructor(tutorRepository: ITutorRepository, userRepository:IUserRepository, notificationRepository:INotificationRepository) {
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository
    }

    async tutorLogin(tutorEmail: string, password: string): Promise<TutorDocument | null> {
        try {
            if(!tutorEmail){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
              }
              console.log("oooo")
            const tutor = await this.tutorRepository.findOne(tutorEmail)
            console.log("oooo")

            if(!tutor){
              console.log("oooo")
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.INVALID_CREDENTIALS)
              }
            if (tutor.password !== password) {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.PASSWORD_MISMATCH);
            }

            const accessToken = helperFunction.accesstoken(tutor.id, "tutor");
            const refreshToken = helperFunction.refreshtoken(tutor.id, "tutor");

            return { ...tutor.toObject(), accessToken, refreshToken };

        } catch (error) {
          throw error
        }
    }

    async uploadPhoto(tutorId: string, fileLocation:string): Promise<TutorDocument | null>{
        try{
            const tutor = await this.tutorRepository.findById(tutorId)
            if (tutor) {
                tutor.profilePic = fileLocation;
                tutor.save();
            }
            return { ...tutor?.toObject()};

        }catch(error){
            throw error;
        }
    }

    async updateProfile(userId: string, updateData: {
        tutorname?: string;
        education?: string;
        experiance?: string;
    }): Promise<TutorDocument | null> {
        try {
            const updatedTutor = await this.tutorRepository.UpdateProfile(userId,updateData );
            return updatedTutor;       
        } catch (error) {
            throw error        
        }
    }

    async enrolledStudents(
        tutorId: string,
        page: number,
        limit: number,
        search: string
      ): Promise<{ users: IUserDocument[]; total: number }> {
        try {
          const skip = (page - 1) * limit;
          
          const pipeline: any[] = [
            {
              $lookup: {
                from: "courses", 
                localField: "purchasedCourses",
                foreignField: "_id",
                as: "purchasedCoursesDetails",
              },
            },
            {
              $match: {
                "purchasedCoursesDetails.tutorId": new mongoose.Types.ObjectId(tutorId),
              },
            }
          ];
      
          if (search && search.trim() !== "") {
            pipeline.push({
              $match: {
                $or: [
                  { userName: { $regex: search, $options: "i" } },
                  { email: { $regex: search, $options: "i" } },
                  { phoneNumber: { $regex: search, $options: "i" } },
                ]
              }
            });
          }
      
          pipeline.push({
            $facet: {
              data: [
                { $skip: skip },
                { $limit: limit },
                {
                  $project: {
                    userName: 1,
                    email: 1,
                    phoneNumber: 1,
                    profilePhoto: 1,
                  }
                }
              ],
              totalCount: [{ $count: "count" }],
            },
          });
      
          const result = await this.userRepository.aggregate(pipeline);
      
          const total = result[0]?.totalCount[0]?.count || 0;
          return { 
            users: result[0]?.data || [], 
            total 
          };
        } catch (error) {
          console.error('Error in enrolledStudents:', error);
          throw error;
        }
      }

      async recentActivity(tutorId: string): Promise<INotification[] | null> {
        try {
            return await this.notificationRepository.recentActivity(tutorId);
        } catch (error) {
            throw error        
        }
    }
      
}

export default TutorService;