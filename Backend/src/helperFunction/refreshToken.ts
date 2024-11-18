// import { Router } from "express";
// import { authMiddleware } from "../middleware/auth.middleware";
// import { Request, Response, NextFunction } from "express";


// const router = Router();


// router.post('/refresh-token', (req, res) => {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       return res.status(401).json({ success: false, message: "No refresh token provided" });
//     }
  
//     jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY as string, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ success: false, message: "Invalid refresh token" });
//       }
  
//       const { _id, role } = decoded as DecodedToken;
//       const newAccessToken = helperFunction.accesstoken(_id, role);
  
//       res.json({ success: true, accessToken: newAccessToken });
//     });
//   });
  