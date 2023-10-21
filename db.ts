require("dotenv").config();
import mongoose from "mongoose";

const MONGODB_URL: string = process.env.DB_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {}).then((data: any) => {
      console.log(`Database connect with ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
