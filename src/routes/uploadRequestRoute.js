import express from "express";
import { uploadRequestController } from "../controllers/UploadRequestController.js";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const uploadRequestRouter = express.Router();

uploadRequestRouter.post("/:id", authenticate, upload.single("file"), uploadRequestController);

export default uploadRequestRouter
