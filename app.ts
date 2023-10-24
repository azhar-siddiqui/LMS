require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";

// body Parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(cors({ origin: process.env.ORIGIN }));

// routes
app.use("/api/v1", userRouter);

// Route not found
app.all("*", (req: Request, resp: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} note found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
