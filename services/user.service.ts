import { Response } from "express";
import userModel from "../models/user.model";

// get user by Id
export const getUserById = async (id: string, resp: Response) => {
  const user = await userModel.findById(id);
  resp.status(200).json({ success: true, user });
};
