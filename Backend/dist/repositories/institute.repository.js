"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteRepository = void 0;
const base_repository_1 = require("./base.repository");
const institute_model_1 = require("../models/institute.model");
class InstituteRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(institute_model_1.InstituteModel);
    }
    async findByEmail(instituteEmail) {
        try {
            return await this.model.findOne({ instituteEmail });
        }
        catch (error) {
            throw error;
        }
    }
    async find() {
        try {
            return await this.model.find();
        }
        catch (error) {
            throw error;
        }
    }
}
exports.InstituteRepository = InstituteRepository;
//# sourceMappingURL=institute.repository.js.map