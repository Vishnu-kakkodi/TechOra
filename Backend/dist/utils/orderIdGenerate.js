"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenerateOrderId {
    constructor() {
        this.lastDate = this.getCurrentDate();
        this.counter = 0;
    }
    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    generateID() {
        const currentDate = this.getCurrentDate();
        if (this.lastDate !== currentDate) {
            this.counter = 0;
            this.lastDate = currentDate;
        }
        this.counter += 1;
        const counterString = String(this.counter).padStart(4, '0');
        return `ORDER-${currentDate}-${counterString}`;
    }
}
const generator = new GenerateOrderId();
exports.default = generator;
//# sourceMappingURL=orderIdGenerate.js.map