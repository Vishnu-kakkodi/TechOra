import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth.types";
import { helperFunction } from "../helperFunction/authHelper";
import { UserModel } from "../models/user.model";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let role = req.headers.role
    console.log("Role:", req.headers);
    console.log("Role1:", role);

    const getCookieByRole = (role: string) => {
      switch (role) {
        case "user":
          return req.cookies.user;
        case "admin":
          return req.cookies.admin;
        case "institute":
          return req.cookies.institute;
        default:
          return null;
      }
    };

    const tokenToValidate = getCookieByRole(role as string);
    console.log("Token to validate:", tokenToValidate);

    if (!tokenToValidate) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
        code: "TOKEN_MISSING"
      });
    }

    const { accessToken, refreshToken } = tokenToValidate;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token provided",
        code: "ACCESS_TOKEN_MISSING"
      });
    }

    const secretKey = process.env.ACCESS_SECRET_KEY as string;

    try {
      const decoded = jwt.verify(accessToken, secretKey) as jwt.JwtPayload;
      
      if (role === "user") {
        const user = await UserModel.findById(decoded._id);
        if (!user || user.status !== "active") {
          return res.status(403).json({
            success: false,
            message: "User account is not active"
          });
        }
      }
      
      req.user = decoded as AuthenticatedRequest["user"];
      next();
    } catch (tokenError) {
      if (tokenError instanceof jwt.TokenExpiredError) {
        console.log("Access token expired, attempting refresh");
        
        if (!refreshToken) {
          return res.status(401).json({
            success: false,
            message: "Access token expired and no refresh token provided",
            code: "REFRESH_TOKEN_MISSING"
          });
        }

        try {
          const refreshDecoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY as string
          ) as jwt.JwtPayload;

          const { _id, role: decodedRole } = refreshDecoded;

          const newAccessToken = helperFunction.accesstoken(_id, decodedRole);

          res.cookie('cookieName', {
            accessToken: newAccessToken,
            refreshToken: refreshToken
          }, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          if (role === "user") {
            const user = await UserModel.findById(_id);
            if (!user || user.status !== "active") {
              return res.status(403).json({
                success: false,
                message: "User account is not active"
              });
            }
          }

          req.user = { _id, role: decodedRole };
          next();
        } catch (refreshError) {
          console.log("Refresh token verification failed:", refreshError);
          return res.status(401).json({
            success: false,
            message: "Invalid refresh token",
            code: "TOKEN_EXPIRED"
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
          code: "TOKEN_INVALID"
        });
      }
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};