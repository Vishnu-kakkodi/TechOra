"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/verify-accessToken", auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({ success: true, message: "Token verified" });
});
router.get("/verify-account-status", auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({ success: true, message: "Token verified" });
});
router.post("/refresh-token", auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({ success: true, message: "Token refreshed" });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map