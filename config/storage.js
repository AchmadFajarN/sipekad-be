import multer from "multer"
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "upload");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
    const currentDate = Date.now()
    cb(null, `${currentDate}-${file.originalname}`)
  }
})

