"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const message_1 = __importDefault(require("../constants/message"));
class CourseService {
    constructor(courseRepository, cartRepository, userRepository, tutorRepository, wishlistRepository) {
        this.courseRepository = courseRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.tutorRepository = tutorRepository;
        this.wishlistRepository = wishlistRepository;
    }
    async createCourse(courseData, tutorId) {
        try {
            if (!courseData.title || !courseData.institutionId) {
                throw new error_middleware_1.HttpException(400, 'Missing required fields');
            }
            if (tutorId) {
                courseData.tutorId = tutorId;
            }
            const response = await this.courseRepository.create(courseData);
            if (!response) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async draftCourse(Query, page, limit, search) {
        try {
            if (!Query.tutorId && !Query.institutionId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const query = {};
            if (Query.institutionId) {
                query.institutionId = Query.institutionId;
            }
            else if (Query.tutorId) {
                query.tutorId = Query.tutorId;
            }
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } },
                ];
            }
            query.status = 'draft';
            const skip = (page - 1) * limit;
            return await this.courseRepository.findDraft(query, skip, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async createModule(id, moduleData) {
        try {
            if (!id) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            if (!moduleData) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const updatedCourse = await this.courseRepository.update(id, moduleData);
            if (!updatedCourse) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return updatedCourse;
        }
        catch (error) {
            throw error;
        }
    }
    async courseList(instituteId, page, limit, search, department, sort) {
        try {
            if (!instituteId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            console.log("Query:", query);
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.courseRepository.findCourses("institutionId", instituteId, query, skip, limit, sortOptions);
        }
        catch (error) {
            throw error;
        }
    }
    async TutorCourseList(tutorId, page, limit, search, department, sort) {
        try {
            if (!tutorId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            console.log("Query:", query);
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.courseRepository.findCourses("tutorId", tutorId, query, skip, limit, sortOptions);
        }
        catch (error) {
            throw error;
        }
    }
    async PurchasedCourse(userId) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const data = await this.userRepository.findById(userId);
            if (!data) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async courseDetail(courseId) {
        try {
            if (!courseId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const data = await this.courseRepository.findById(courseId);
            if (!data) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async addToCart(userId, courseId) {
        try {
            if (!courseId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            let cart = await this.cartRepository.findCart(userId);
            let course = await this.courseRepository.findById(courseId);
            if (!course) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const newItem = {
                course: new mongoose_1.default.Types.ObjectId(courseId),
                price: (course === null || course === void 0 ? void 0 : course.price) || 0,
                subTotal: (course === null || course === void 0 ? void 0 : course.price) || 0,
            };
            const courseExists = cart === null || cart === void 0 ? void 0 : cart.items.some(item => item.course.id.toString() === courseId);
            let information = 'Item added successfully';
            if (courseExists) {
                return information = 'Already added';
            }
            console.log("Test");
            if (cart) {
                cart.items.push(newItem);
                cart.totalItems += 1;
                cart.totalPrice += (course === null || course === void 0 ? void 0 : course.price) || 0;
                await cart.save();
                return information;
            }
            else {
                await this.cartRepository.createCart(userId, [newItem], 1, (course === null || course === void 0 ? void 0 : course.price) || 0);
                return information;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getCartItems(userId) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const data = await this.cartRepository.findCart(userId);
            if (!data) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async removeCart(userId, courseId) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const cart = await this.cartRepository.findCart(userId);
            if (!cart) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            if (cart) {
                await this.cartRepository.remove(userId, courseId);
            }
        }
        catch (error) {
            throw error;
        }
    }
    async userCorseList(page, limit, search, department, sort) {
        try {
            const skip = (page - 1) * limit;
            let query = {};
            let sortOptions = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { instructor: { $regex: search, $options: 'i' } }
                ];
            }
            if (department && department.trim() !== '') {
                const departmentArray = department.split(',').map((dep) => dep.trim());
                query.department = { $in: departmentArray };
            }
            switch (sort) {
                case 'newest':
                    sortOptions = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOptions = { createdAt: 1 };
                    break;
                default:
                    sortOptions = { createdAt: -1 };
            }
            return await this.courseRepository.findCourse(query, skip, limit, sortOptions);
        }
        catch (error) {
            throw error;
        }
    }
    async courseAction(courseId) {
        try {
            if (!courseId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const data = await this.courseRepository.findById(courseId);
            if (!data) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            let information;
            if ((data === null || data === void 0 ? void 0 : data.isListed) === true) {
                data.isListed = false;
                information = 'Course Unlisted successfully';
            }
            else if ((data === null || data === void 0 ? void 0 : data.isListed) === false) {
                data.isListed = true;
                information = 'Course listed successfully';
            }
            data === null || data === void 0 ? void 0 : data.save();
            return information;
        }
        catch (error) {
            throw error;
        }
    }
    async updateCourse(courseData, courseId) {
        try {
            return await this.courseRepository.updateCourse(courseData, courseId);
        }
        catch (error) {
            throw error;
        }
    }
    async moduleDelete(courseId, moduleId) {
        try {
            return await this.courseRepository.moduleDelete(courseId, moduleId);
        }
        catch (error) {
            throw error;
        }
    }
    async chartData(instituteId) {
        try {
            if (!instituteId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.UNAUTHORIZED, message_1.default.ERROR.UNAUTHORIZED);
            }
            const { published, draft, listed, unlisted, course } = await this.courseRepository.chartData(instituteId);
            return { published, draft, listed, unlisted, course };
        }
        catch (error) {
            throw error;
        }
    }
    async addToWishlist(userId, courseId) {
        try {
            if (!courseId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            let wishlist = await this.wishlistRepository.find(userId);
            let course = await this.courseRepository.findById(courseId);
            if (!course) {
                throw new error_middleware_1.HttpException(statusCode_1.default.NOT_FOUND, message_1.default.ERROR.DATA_NOTFOUND);
            }
            const newItem = {
                course: new mongoose_1.default.Types.ObjectId(courseId),
            };
            const courseExists = wishlist === null || wishlist === void 0 ? void 0 : wishlist.items.some(item => item.course.toString() === courseId.toString());
            let information = 'Item added successfully';
            if (courseExists) {
                return information = 'Already added';
            }
            if (wishlist) {
                wishlist.items.push(newItem);
                await wishlist.save();
                return information;
            }
            else {
                const createdItem = {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    items: [
                        newItem
                    ]
                };
                await this.wishlistRepository.create(createdItem);
                return information;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async wishlistPage(userId, page, limit, search) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            const skip = (page - 1) * limit;
            let query = {};
            if (search && search.trim() !== '') {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }
                ];
            }
            return await this.wishlistRepository.findFavourates(userId, query, skip, limit);
        }
        catch (error) {
            throw error;
        }
    }
    async removeWishlist(userId, courseId) {
        try {
            if (!userId) {
                throw new error_middleware_1.HttpException(statusCode_1.default.BAD_REQUEST, message_1.default.ERROR.BAD_REQUEST);
            }
            return await this.wishlistRepository.removeWishlist(userId, courseId);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map