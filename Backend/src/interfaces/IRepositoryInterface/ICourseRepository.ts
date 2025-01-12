import mongoose, { FilterQuery,Types } from "mongoose";
import { CourseDocument, Module } from "../../type/course.type";
import { UpdateCourseDto } from "../../dtos/course.dtos";
import { IBaseRepository } from "./IBaseRepository";




export type SearchCourse = FilterQuery<{
    title: string;
    department: string;
    instructor: string;
}>;



export interface ICourseRepository extends IBaseRepository<CourseDocument>{
    findDraft(query: any,skip: number,limit: number): Promise<{ course: CourseDocument[]; total: number }>
    findById(courseId: string): Promise<CourseDocument | null>
    update(id: string, data: Partial<Module>): Promise<CourseDocument | null>
    updateCourse(courseData: UpdateCourseDto, courseId: string): Promise<CourseDocument | null>
    moduleDelete(courseId: string, moduleId: string): Promise<void>
    findCourses(filterKey: string, filterValue: string,searchQuery: SearchCourse,skip: number,limit: number,sortOptions: any): Promise<{ course: CourseDocument[]; total: number }>
    find(): Promise<CourseDocument[]>
    findCourse(searchQuery: SearchCourse, skip: number, limit: number, sortOptions: any): Promise<{ course: CourseDocument[]; total: number; department: string[]; totalCourse: number }>
    findMyCourse(MyCourses: Types.ObjectId[],searchQuery: SearchCourse,skip: number,limit: number): Promise<{ course: CourseDocument[] | null; total: number }>
    chartData(instituteId: string): Promise<{ published: number, draft: number, listed: number, unlisted: number, course: CourseDocument[] }>
    homeData(): Promise<{ course: CourseDocument[] }>
    incrementEnrolledStudents(courseIds: mongoose.Types.ObjectId[]): Promise<void>
}
