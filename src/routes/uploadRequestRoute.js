import express from "express";
import { uploadRequestController } from "../controllers/UploadRequestController.js";
import { authenticate } from "../middlewares/auth.js";

const uploadRequestRouter = express.Router();

uploadRequestRouter.post("/:id", authenticate, uploadRequestController);

export default uploadRequestRouter
