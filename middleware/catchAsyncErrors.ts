import { NextFunction, Request, Response } from "express";

export const catchAsyncError =
  (theFunc: any) => (req: Request, resp: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, resp, next)).catch(next);
  };
