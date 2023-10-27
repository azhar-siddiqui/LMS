import { Response } from "express";
import CourseModal from "../models/course.modal";
import { catchAsyncError } from "../middleware/catchAsyncErrors";

// create course
export const createCourse = catchAsyncError(
  async (data: any, resp: Response) => {
    const course = await CourseModal.create(data);
    resp.status(201).json({ status: true, course });
  }
);
