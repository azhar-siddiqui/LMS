require("dotenv").config();
import { app } from "./app";
import connectDB from "./db/db";

const PORT = process.env.PORT;

// create server
app.listen(PORT, () => {
  console.log(`server is is running on ${PORT}`);
  connectDB();
});
