import { BaseRepository } from "./base.repository";
import { CourseModel } from "../models/course.model";
import { CourseDocument, Module } from "../interfaces/course.interface";


export class CourseRepository extends BaseRepository<CourseDocument> {
    constructor(){
        super(CourseModel);
    }

    async findDraft(instituteId: any): Promise<CourseDocument[]> { 
        try {
            console.log("Repoosos");
            
            return await this.model.find({institutionId: instituteId});
        } catch (error) {
            throw error;
        }
    }

    
    async findById(courseId : string): Promise<CourseDocument | null> { 
        try {
            console.log("instituteId",typeof(courseId));         
            const course =  await this.model.findById({_id: courseId});
            console.log(course,"ufdsakdgks");
            return course;           
        } catch (error) {
            throw error;
        }
    }


    async update(id: string, data: Partial<Module>): Promise<CourseDocument | null> {
        try {
            const existingCourse = await this.model.findById(id);
            if (!existingCourse) {
                return null;
            }

            existingCourse.modules.push({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Module);

            existingCourse.status = 'published'

            await existingCourse.save();
            return existingCourse.toObject();
        } catch (error) {
            console.error("Error occurred during update:", error);
            throw error;
        }
    }

    async findCourses(instituteId: string): Promise<CourseDocument[]>{
        try{
            return await this.model.find({
                institutionId: instituteId,
                status: 'published'
            });
        }catch(error){
            throw error;
        }
    }

    async find(): Promise<CourseDocument[]> { 
        try {
            console.log("Repoosos");
            
            return await this.model.find({status:'published'});
        } catch (error) {
            throw error;
        }
    }

}