"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const institution_routes_1 = __importDefault(require("./routes/institution.routes"));
const tutor_routes_1 = __importDefault(require("./routes/tutor.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socketConfig_1 = __importDefault(require("./socketConfig"));
const http_1 = __importDefault(require("http"));
const stripe = require("stripe")(process.env.STRIPE_SECRET);
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/institution', institution_routes_1.default);
app.use('/api/tutor', tutor_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
socketConfig_1.default.initializeSocket(server);
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techOra')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error('MongoDB connection:', err));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map