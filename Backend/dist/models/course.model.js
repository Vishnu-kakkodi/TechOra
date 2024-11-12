"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModel = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
}, { timestamps: true });
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    institutionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    modules: {
        type: [moduleSchema],
        default: [],
        validate: [{
                validator: function (modules) {
                    if (this.status === 'published') {
                        return modules.length > 0;
                    }
                    return true;
                },
                message: 'Published courses must have at least one module'
            }]
    },
    totalModules: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
courseSchema.pre('save', function (next) {
    if (this.modules) {
        this.totalModules = this.modules.length;
        this.totalDuration = this.modules.reduce((total, module) => total + module.duration, 0);
    }
    if (this.status === 'published' && (!this.modules || this.modules.length === 0)) {
        next(new Error('Cannot publish a course without modules'));
        return;
    }
    next();
});
courseSchema.pre('validate', function (next) {
    if (this.status === 'published') {
        const hasUnpublishedModules = this.modules.some(module => module.status === 'draft');
        if (hasUnpublishedModules) {
            next(new Error('Cannot publish course with draft modules'));
            return;
        }
    }
    next();
});
exports.CourseModel = (0, mongoose_1.model)('Course', courseSchema);
//# sourceMappingURL=course.model.js.map