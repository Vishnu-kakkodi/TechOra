

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth.types";
import { helperFunction } from "../helperFunction/authHelper";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): any => {
  try {
    const tokenToValidate = req.cookies.user;
    if (!tokenToValidate) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    const { accessToken, refreshToken } = tokenToValidate;
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token provided",
      });
    }

    const secretKey = process.env.ACCESS_SECRET_KEY as string;
    console.log("Cookies:", req.cookies);

    jwt.verify(accessToken, secretKey, (err: any, decoded: any) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          console.log("Access token expired, attempting refresh");
          if (!refreshToken) {
            return res.status(401).json({
              success: false,
              message: "Access token expired, and no refresh token provided",
            });
          }

          jwt.verify(
            refreshToken, 
            process.env.REFRESH_SECRET_KEY as string, 
            (refreshErr: any, refreshDecoded: any) => {
              if (refreshErr) {
                console.log("Refresh token verification failed:", refreshErr);
                return res.status(403).json({
                  success: false,
                  message: "Invalid refresh token",
                });
              }

              const { _id, role } = refreshDecoded;
              const newAccessToken = helperFunction.accesstoken(_id, role);

              res.cookie('user', {
                accessToken: newAccessToken,
                refreshToken: refreshToken
              }, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
              });

              req.user = { _id, role };
              next();
            }
          );
        } else {
          return res.status(401).json({
            success: false,
            message: "Invalid access token",
          });
        }
      } else {
        req.user = decoded as AuthenticatedRequest["user"];
        next();
      }
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};