import { uploadResponseController } from "../controllers/UploadResponseController.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const uploadResponseRoutes = express.Router();

uploadResponseRoutes.post("/:id", authenticate, upload.single("file") ,uploadResponseController);

export default uploadResponseRoutes;