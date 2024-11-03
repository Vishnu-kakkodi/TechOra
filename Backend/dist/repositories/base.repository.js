"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            console.log("baseRepo", data);
            const item = await this.model.create(data);
            return item.toObject();
        }
        catch (error) {
            console.error(error, "Error is occured");
            throw error;
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map