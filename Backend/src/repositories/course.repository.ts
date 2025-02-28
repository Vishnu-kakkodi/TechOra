import { BaseRepository } from "./base.repository";
import { CourseModel } from "../models/course.model";
import { CourseDocument, Module } from "../type/course.type";
import mongoose, { FilterQuery, Types } from 'mongoose'
import { UpdateCourseDto } from "../dtos/course.dtos";
import { ICourseRepository } from "../interfaces/IRepositoryInterface/ICourseRepository";

export type SearchCourse = FilterQuery<{
    title: string;
    department: string;
    instructor: string;
}>;



export class CourseRepository extends BaseRepository<CourseDocument> implements ICourseRepository {
    
    constructor() {
        super(CourseModel);
    }
      
    
    async findDraft(
        query: any,
        skip: number,
        limit: number,
    ): Promise<{ course: CourseDocument[]; total: number }> {
        try {
            const course = await this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .populate('tutorId');

            const total: number = await this.model.countDocuments(query);

            return { course, total };
        } catch (error) {
            throw error;
        }
    }
      


    async findById(courseId: string): Promise<CourseDocument | null> {
        try {
            const id = new mongoose.Types.ObjectId(courseId)
            const course = await this.model.findById({ _id: id }).populate('tutorId')
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
            existingCourse.status = 'published';
            await existingCourse.save();
            return existingCourse.toObject();
        } catch (error) {
            throw error;
        }
    }

    async updateCourse(courseData: UpdateCourseDto, courseId: string): Promise<CourseDocument | null> {
        try {
            const id = new mongoose.Types.ObjectId(courseId)
            const existingCourse = await this.model.findById(id);
            if (!existingCourse) {
                return null;
            }
            if (courseData.title) {
                existingCourse.title = courseData.title
            }
            if (courseData.department) {
                existingCourse.department = courseData.department
            }
            if (courseData.duration) {
                existingCourse.duration = courseData.duration
            }
            if (courseData.description) {
                existingCourse.description = courseData.description
            }

            if (courseData.price) {
                existingCourse.price = courseData.price;
            }

            return await existingCourse.save();
        } catch (error) {
            throw error;
        }
    }


    async moduleDelete(courseId: string, moduleId: string): Promise<void> {
        try {
            const courseObjectId = new mongoose.Types.ObjectId(courseId);
            const moduleObjectId = new mongoose.Types.ObjectId(moduleId);
            await this.model.findByIdAndUpdate(
                courseObjectId,
                { $pull: { modules: { _id: moduleObjectId } } },
                { new: true }
            );
            return
        } catch (error) {
            throw error;
        }
    }

    async findCourses(
        filterKey: string,
        filterValue: string,
        searchQuery: SearchCourse,
        skip: number,
        limit: number,
        sortOptions: any = { createdAt: -1 }
    ): Promise<{ course: CourseDocument[]; total: number }> {
        try {
            const filter: Record<string, any> = {
                [filterKey]: filterValue,
                status: 'published',
                ...searchQuery,
            };

            const course = await this.model
                .find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('tutorId');

            const total: number = await this.model.countDocuments(filter);

            return { course, total };
        } catch (error) {
            throw error;
        }
    }

    async find(): Promise<CourseDocument[]> {
        try {
            return await this.model.find({ status: 'published', isListed: true }).populate('institutionId');
        } catch (error) {
            throw error;
        }
    }

    async findCourse(searchQuery: SearchCourse, skip: number, limit: number, sortOptions: any = { createdAt: -1 }
    ): Promise<{ course: CourseDocument[]; total: number; department: string[]; totalCourse: number }> {
        try {
            const course = await this.model.find({ isListed: true, status: 'published', ...searchQuery })
                .select({ 'modules.video': 0 })
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate([{
                    path: 'tutorId',
                    select:'tutorname department education experiance profilePic'
                }, {
                    path: 'institutionId',
                    select:'collegeName'
                }
                ]);
            const totalCourse: number = await this.model.countDocuments({ isListed: true, status: 'published' });
            const total: number = await this.model.countDocuments({ isListed: true, status: 'published' }, searchQuery);
            const department: string[] = await this.model.distinct("department");
            return { course, total, department, totalCourse };

        } catch (error) {
            throw error;
        }
    }

    async findMyCourse(
        MyCourses: Types.ObjectId[],
        searchQuery: SearchCourse,
        skip: number,
        limit: number
    ): Promise<{ course: CourseDocument[] | null; total: number }> {
        try {
            const query = {
                _id: { $in: MyCourses },
                ...searchQuery,
            };

            const course = await this.model
                .find(query)
                .skip(skip)
                .limit(limit)
                .populate([{
                    path: 'tutorId',
                    select:'tutorname department education experiance profilePic'
                }]);

            const total = await this.model.countDocuments(query);

            return { course, total };
        } catch (error) {
            throw error;
        }
    }

    async chartData(instituteId: string): Promise<{ published: number, draft: number, listed: number, unlisted: number, course: CourseDocument[] }> {
        try {
            const published: number = await this.model.countDocuments({ status: 'published' });
            const course = await this.model.find({ institutionId: instituteId, status: 'published' })
                .sort({ createdAt: -1 })
                .limit(4);
            const draft: number = await this.model.countDocuments({ status: 'draft' });
            const listed: number = await this.model.countDocuments({ isListed: true });
            const unlisted: number = await this.model.countDocuments({ status: false });
            return {
                published,
                draft,
                listed,
                unlisted,
                course
            };
        } catch (error) {
            throw error;
        }
    }


    async homeData(): Promise<{ course: CourseDocument[] }> {
        try {
            const published: number = await this.model.countDocuments({ status: 'published' });
            const course = await this.model.find({ status: 'published' })
                .sort({ createdAt: -1 })
                .limit(4)
                .populate('tutorId');
            return {
                course
            };
        } catch (error) {
            throw error;
        }
    }

    async incrementEnrolledStudents(courseIds: mongoose.Types.ObjectId[]): Promise<void> {
        await this.model.updateMany(
            { _id: { $in: courseIds } },
            { $inc: { enrolledStudents: 1 } }
        );
    }


}