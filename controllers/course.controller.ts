import express, { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModal from "../models/course.modal";
import { redis } from "../utils/radis";

// upload course
export const uploadCourse = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, resp, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get single course
export const getSingleCourse = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      /** we are checking checking in redis data for if 1000 user visit website at once but only 800
       people are purchase the course so we are storing data in cache that why we are using redis */
      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        resp.status(200).json({ status: true, course });
      } else {
        const course = await CourseModal.findById(courseId).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
        );
        await redis.set(courseId, JSON.stringify(course));
        resp.status(200).json({ status: true, course });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all course
export const getAllCourse = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get("allCourses");

      if (isCacheExist) {
        const courses = JSON.parse(isCacheExist);
        resp.status(200).json({ status: true, courses });
      } else {
        const courses = await CourseModal.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(courses));
        resp.status(200).json({ status: true, courses });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// edit course
export const editCourse = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;

      const course = await CourseModal.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      resp.status(201).json({ success: true, course });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete course only admin can delete this
export const deleteCourse = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const course = await CourseModal.findOneAndDelete(req.body.id);

      resp.status(200).json({ status: true, message: "" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all course content for purchased user only
export const getCourseByUser = catchAsyncError(
  async (req: Request, resp: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (course: any) => course._id === courseId
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModal.findById(courseId);
      const courseContent = course?.courseData;
      resp.status(200).json({ status: true, course: courseContent });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
