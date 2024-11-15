import { Institute, InstituteDocument, InstituteResponse, InstituteStatus } from "../interfaces/institute.interface";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateTutorDto, CreateUserDto } from "../dtos/institute.dtos";
import nodemailer from 'nodemailer';
import Mail from "nodemailer/lib//mailer";
import helperFunction from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import generator from "../utils/generateApplicationID";
import { application } from "express";
import { Tutor } from "../interfaces/tutor.interface";
import { TutorRepository } from "../repositories/tutor.repository";
import { CreateCourseDto } from "../dtos/course.dtos";
import { CourseRepository } from "../repositories/course.repository";
import { Course, CourseDocument, Module } from "../interfaces/course.interface";
import { CartDocument } from "../interfaces/cart.interface";
import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { CartModel } from "../models/cart.model";
import mongoose from "mongoose";

interface ModuleData extends Module{
    draftId: string;
}

export class CourseService {
    private courseRepository: CourseRepository;
    private cartRepository: CartRepository;

    constructor(courseRepository: CourseRepository, cartRepository: CartRepository) {
        this.courseRepository = courseRepository;
        this.cartRepository = cartRepository;
    }

    async createCourse(courseData: CreateCourseDto): Promise<Course> {
        try {
            if (!courseData.title || !courseData.institutionId) {
                throw new HttpException(400, 'Missing required fields');
            }

            console.log('Creating course with data:', courseData);
            const response = await this.courseRepository.create(courseData);
            console.log('Course created:', response);
            return response;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    }

    async draftCourse(instituteId: any): Promise<any>{
        console.log("dfdd");
        
        const data =  await this.courseRepository.find(instituteId)      
        console.log(data,"Data");
        return data;
        
    }


      async createModule(id: string, moduleData: Module): Promise<CourseDocument | null> {
        try {
          const updatedCourse = await this.courseRepository.update(id, moduleData);
          return updatedCourse;
        } catch (error) {
          console.error(error, "Error occurred in createModule");
          throw error;
        }
      }

      async courseList(instituteId: any): Promise<any>{

        try{
          const data = await this.courseRepository.findCourses(instituteId)
          return data
        }catch(error){
          throw error
        }
      }

      async courseDetail(courseId: string): Promise<CourseDocument | null>{
        try{
          const data = await this.courseRepository.findById(courseId)
          return data;
        }catch(error){
          throw error;
        }
      }

      async addToCart(userId:string, courseId:string): Promise<void>{
        try{
          console.log("cart")
          let cart = await this.cartRepository.findCart(userId);
          console.log(cart,"Cart")
          let course = await this.courseRepository.findById(courseId);
          const newItem = {
            course: new mongoose.Types.ObjectId(courseId),
            price: (course?.price) || 0,
            subTotal:(course?.price) || 0, 
        };

        if(cart && cart.length > 0){
          cart[0].items.push(newItem);
          cart[0].totalItems += 1;
          cart[0].totalPrice += course?.price || 0;
          await cart[0].save();
        }else{
          await this.cartRepository.createCart(
            userId,
            [newItem],
            1,
            course?.price || 0 
          )
        }
        }catch(error){
          throw error
        }
      }

      async getCartItems(userId: string): Promise<CartDocument[]>{
        try{
          const data = await this.cartRepository.findCart(userId);
          return data
        }catch(error){
          throw error;
        }
      }
    
    }

