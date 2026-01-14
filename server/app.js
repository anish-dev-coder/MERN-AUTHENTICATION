import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import ConnectDB from "./confing/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 3000;

ConnectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`server start on http://localhost:${port}`);
});
