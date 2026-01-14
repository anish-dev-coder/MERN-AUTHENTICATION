import mongoose from "mongoose";

const ConnectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database Connected Successfully!");
};

export default ConnectDB;
