import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //   wrong MongoDB id Server
  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid Err ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //   Duplicate Error
  if (err.statusCode === 1100) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  //   wrong JWT Token Err
  if (err.name === "jsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // Jwt expire err
  if (err.name === "TokenExpiredError") {
    const message = `Json web Token is expired please try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    status: false,
    message: err.message,
  });
};
