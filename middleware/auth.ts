import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";

import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/radis";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Authenticated User
export const isAuthenticated = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(new ErrorHandler("Please login to get access", 400));
    }

    const decoded = jwt.verify(
      accessToken,
      ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not Found", 400));
    }

    req.user = JSON.parse(user);
    next();
  }
);

// Validate user Role

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, resp: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
