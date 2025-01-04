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

class TutorService implements ITutorService {
    private tutorRepository: TutorRepository;
    private userRepository: UserRepository;
    private notificationRepository: NotificationRepository;

    constructor(tutorRepository: TutorRepository, userRepository:UserRepository, notificationRepository:NotificationRepository) {
        this.tutorRepository = tutorRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository
    }

    async tutorLogin(tutorEmail: string, password: string): Promise<TutorDocument | null> {
        try {
            if(!tutorEmail){
                throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
              }
            const tutor = await this.tutorRepository.findOne(tutorEmail)
            if(!tutor){
                throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
              }
            if (tutor.password !== password) {
                throw new HttpException(400, "Password mismatch");
            }

            const accessToken = helperFunction.accesstoken(tutor.id, "tutor");
            const refreshToken = helperFunction.refreshtoken(tutor.id, "tutor");

            return { ...tutor.toObject(), accessToken, refreshToken };

        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
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