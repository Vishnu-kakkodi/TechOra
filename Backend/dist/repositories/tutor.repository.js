"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorRepository = void 0;
const base_repository_1 = require("./base.repository");
const tutor_model_1 = require("../models/tutor.model");
class TutorRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(tutor_model_1.TutorModel);
    }
}
exports.TutorRepository = TutorRepository;
//# sourceMappingURL=tutor.repository.js.map