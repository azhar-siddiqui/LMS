import { Response } from "express";
import { redis } from "../utils/radis";

// get user by Id
export const getUserById = async (id: string, resp: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    resp.status(200).json({ success: true, user });
  }
};
