import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

app.use("/users", userRouter);
app.use("auth", authRouter);

export default app;
