import express from "express";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import pengajuanRouter from "./routes/requestRouter.js";
import cors from "cors";
import responseRouter from "./routes/responseRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import uploadRequestRouter from "./routes/uploadRequestRoute.js";
import path from "path";
import uploadResponseRoutes from "./routes/uploadResponse.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/request", pengajuanRouter);
app.use("/response", responseRouter);
app.use("/dashboard", dashboardRouter);
app.use("/upload", express.static(path.join(process.cwd(), "upload")));
app.use("/upload-request", uploadRequestRouter);
app.use("/upload-response", uploadResponseRoutes);

export default app;
