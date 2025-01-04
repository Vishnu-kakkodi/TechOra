import { Request, Response, NextFunction } from "express";
import { CourseService } from "../../services/course.service";
import { Course, CourseDocument, Module } from "../../type/course.type";
import { CreateCourseDto, UpdateCourseDto } from "../../dtos/course.dtos";
import { IUserDocument } from "../../type/user.type";



export interface ICourseService{


    createCourse(courseData: CreateCourseDto, tutorId: string): Promise<Course>
    draftCourse(Query: { tutorId?: string; institutionId?: string },page: number,limit: number,search: string): Promise<any>
    createModule(id: string, moduleData: Module): Promise<CourseDocument | null>
    courseList(instituteId: any, page: number, limit: number, search: string, department: string, sort: string): Promise<{ course: CourseDocument[]; total: number; }>
    TutorCourseList(tutorId: any, page: number, limit: number, search: string, department: string, sort: string): Promise<{ course: CourseDocument[]; total: number; }>
    PurchasedCourse(userId: string): Promise<IUserDocument | null>
    courseDetail(courseId: string): Promise<CourseDocument | null>
    userCorseList(page: number, limit: number, search: string, department: string, sort: string): Promise<{ course: CourseDocument[]; total: number; department: string[], totalCourse: number }>
    courseAction(courseId: string): Promise<any>
    updateCourse(courseData: UpdateCourseDto, courseId: string): Promise<Course | null>
    moduleDelete(courseId: string, moduleId: string): Promise<void>
    chartData(instituteId: any): Promise<{ published: number, draft: number, listed: number, unlisted: number, course: CourseDocument[] }>
}