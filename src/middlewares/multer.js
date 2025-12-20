import multer from "multer";
import { storage } from "../../config/storage.js";

export const upload = multer({ storage });
