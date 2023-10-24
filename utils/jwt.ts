import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./radis";
require("dotenv").config();

interface ITokenOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSide: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE;
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE;

export const sendToken = (user: IUser, statusCode: number, resp: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session  to redis to maintaining cache
  redis.set(user._id, JSON.stringify(user) as any);
  //parse enviroment variables to integrate with fallback values
  const accessTokenExpire = parseInt(ACCESS_TOKEN_EXPIRE || "300", 10);
  const refreshTokenExpire = parseInt(REFRESH_TOKEN_EXPIRE || "1200", 10);

  // options for cookies
  const accessTokenOptions: ITokenOption = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSide: "lax",
  };

  const refreshTokenOptions: ITokenOption = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSide: "lax",
  };

  // only set secure true1
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  resp.cookie("accessToken", accessToken, accessTokenOptions);
  resp.cookie("refreshToken", refreshToken, refreshTokenOptions);

  resp.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
