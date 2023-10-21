import { app } from "./app";
import connectDB from "./db";
require("dotenv").config();

const PORT = process.env.PORT;
// create server
app.listen(PORT, () => {
  console.log(`server is is running on ${PORT}`);
  connectDB();
});
