import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/verify-accessToken", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Token verified" });
});

router.post("/refresh-token", authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Token refreshed" });
});

export default router;
