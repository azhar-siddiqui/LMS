import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./db/db";

require("dotenv").config();

const PORT = process.env.PORT;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY;

// cloudinary config
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET_KEY,
});

// create server
app.listen(PORT, () => {
  console.log(`server is is running on ${PORT}`);
  connectDB();
});
