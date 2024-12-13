import { HttpException } from "../middleware/error.middleware";
import { CreateCourseDto, UpdateCourseDto } from "../dtos/course.dtos";
import { CourseRepository } from "../repositories/course.repository";
import { Course, CourseDocument, Module } from "../interfaces/course.interface";
import { CartDocument } from "../interfaces/cart.interface";
import { CartRepository } from "../repositories/cart.repository";
import mongoose from "mongoose";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";
import { QuizDocument } from "../interfaces/quiz.interface";
import { TutorRepository } from "../repositories/tutor.repository";


export class CourseService {
  private courseRepository: CourseRepository;
  private cartRepository: CartRepository;
  private userRepository: UserRepository;
  private tutorRepository: TutorRepository;


  constructor(courseRepository: CourseRepository, cartRepository: CartRepository, userRepository: UserRepository, tutorRepository: TutorRepository) {
    this.courseRepository = courseRepository;
    this.cartRepository = cartRepository;
    this.userRepository = userRepository;
    this.tutorRepository = tutorRepository;
  }

  async createCourse(courseData: CreateCourseDto, tutorId: string): Promise<Course> {
    try {
      if (!courseData.title || !courseData.institutionId) {
        throw new HttpException(400, 'Missing required fields');
      }
      if(tutorId){
        courseData.tutorId = tutorId;
      }
      console.log(courseData)
      const response = await this.courseRepository.create(courseData);
      if (!response) {
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async draftCourse(tutorId: any): Promise<any> {
    try{
      if(!tutorId){
        throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
      }
      const data = await this.courseRepository.findDraft(tutorId)
      if(!data){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
    return data;
    }catch(error){
      throw error;
    }

  }


  async createModule(id: string, moduleData: Module): Promise<CourseDocument | null> {
    try {
      if(!id){
        throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
      }
      if(!moduleData){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      const updatedCourse = await this.courseRepository.update(id, moduleData);
      if(!updatedCourse){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return updatedCourse;
    } catch (error) {
      throw error;
    }
  }

  async courseList(instituteId: any, page:number,limit:number,search:string,department:string,sort:string): Promise<{ course: CourseDocument[]; total: number;}> {
    try {
      if(!instituteId){
        throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
      }
      const skip = (page - 1) * limit;
      let query:any = {};
      let sortOptions: any = {};

      if (search && search.trim() !== '') {
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { department: { $regex: search, $options: 'i' } },
              { instructor: { $regex: search, $options: 'i' } }


          ];
      }

      if (department && department.trim() !== '') {
          console.log('Status received:', department);
          const departmentArray = department.split(',').map((dep)=>dep.trim());
          
          query.department = { $in:departmentArray };
      }

      console.log("Query:", query);

      switch(sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }

      return await this.courseRepository.findCourses("institutionId",instituteId,query,skip,limit,sortOptions);

    } catch (error) {
      throw error;
    }
  }


  async TutorCourseList(tutorId: any, page:number,limit:number,search:string,department:string,sort:string): Promise<{ course: CourseDocument[]; total: number;}> {
    try {
      if(!tutorId){
        throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
      }
      const skip = (page - 1) * limit;
      let query:any = {};
      let sortOptions: any = {};

      if (search && search.trim() !== '') {
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { department: { $regex: search, $options: 'i' } },
              { instructor: { $regex: search, $options: 'i' } }
          ];
      }

      if (department && department.trim() !== '') {
          console.log('Status received:', department);
          const departmentArray = department.split(',').map((dep)=>dep.trim());
          
          query.department = { $in:departmentArray };
      }

      console.log("Query:", query);

      switch(sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }

      return await this.courseRepository.findCourses("tutorId",tutorId,query,skip,limit,sortOptions);

    } catch (error) {
      throw error;
    }
  }

  async PurchasedCourse(userId: string): Promise<IUserDocument | null> {
    try {
      if(!userId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const data = await this.userRepository.findById(userId)
      if(!data){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async courseDetail(courseId: string): Promise<CourseDocument | null> {
    try {
      if(!courseId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const data = await this.courseRepository.findById(courseId)
      if(!data){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(userId: string | null, courseId: string): Promise<any> {
    try {   
      if(!courseId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      if(!userId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      let cart = await this.cartRepository.findCart(userId);

      let course = await this.courseRepository.findById(courseId);



      if(!course){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      const newItem = {
        course: new mongoose.Types.ObjectId(courseId),
        price: (course?.price) || 0,
        subTotal: (course?.price) || 0,
      };

      const courseExists = cart?.items.some(
        item => item.course.id.toString() === courseId
      );

      let information:string = 'Item added successfully'

      if (courseExists) {
        return information = 'Already added'
      }

      console.log("Test");
      

      if (cart) {
        cart.items.push(newItem);
        cart.totalItems += 1;
        cart.totalPrice += course?.price || 0;
        await cart.save();
        return information
      } else {
        await this.cartRepository.createCart(
          userId,
          [newItem],
          1,
          course?.price || 0
        )
        return information
      }
    } catch (error) {
      throw error;
    }
  }

  async getCartItems(userId: string | null): Promise<CartDocument | null> {
    try {
      if(!userId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const data = await this.cartRepository.findCart(userId);
      if(!data){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      return data
    } catch (error) {
      throw error;
    }
  }

  async removeCart(userId: string | null, courseId: string): Promise<void> {
    try {
      if(!userId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const cart = await this.cartRepository.findCart(userId);
      if(!cart){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      if (cart) {
        await this.cartRepository.remove(userId, courseId)
      }

    } catch (error) {
      throw error;
    }
  }


  async userCorseList(page:number,limit:number,search:string,department:string,sort:string): Promise<{ course: CourseDocument[]; total: number; department:string[], totalCourse:number }> {
    try {
      const skip = (page - 1) * limit;
      let query:any = {};
      let sortOptions: any = {};

      if (search && search.trim() !== '') {
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { department: { $regex: search, $options: 'i' } },
              { instructor: { $regex: search, $options: 'i' } }


          ];
      }

      if (department && department.trim() !== '') {
          console.log('Status received:', department);
          const departmentArray = department.split(',').map((dep)=>dep.trim());
          
          query.department = { $in:departmentArray };
      }

      console.log("Query:", query);

      switch(sort) {
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }

      return await this.courseRepository.findCourse(query,skip,limit,sortOptions);
  } catch (error) {
      throw error;
  }
  }

  async courseAction(courseId: string): Promise<any> {
    try {
      if(!courseId){
        throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.BAD_REQUEST)
      }
      const data = await this.courseRepository.findById(courseId)
      if(!data){
        throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.DATA_NOTFOUND)
      }
      let information
      if (data?.isListed === true) {
        data.isListed = false
        information = 'Course Unlisted successfully'
      } else if (data?.isListed === false) {
        data.isListed = true
        information = 'Course listed successfully'
      }
      data?.save();
      return information
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(courseData: UpdateCourseDto, courseId:string): Promise<Course|null> {
    try {
      return await this.courseRepository.updateCourse(courseData,courseId);
    } catch (error) {
      throw error;
    }
  }


  async moduleDelete(courseId: string, moduleId:string): Promise<void> {
    try {
      return await this.courseRepository.moduleDelete(courseId,moduleId);
    } catch (error) {
      throw error;
    }
  }

  async chartData(instituteId: any): Promise<{published:number, draft:number,listed:number,unlisted:number,course:CourseDocument[]}> {
    try {
      if(!instituteId){
        throw new HttpException(STATUS_CODES.UNAUTHORIZED, MESSAGES.ERROR.UNAUTHORIZED)
      }
      const {published,draft,listed,unlisted,course} = await this.courseRepository.chartData(instituteId)

      return {published,draft,listed,unlisted,course}
      
    } catch (error) {
      throw error;
    }
  }

}


