import { IUser } from "./../models/user.model";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
