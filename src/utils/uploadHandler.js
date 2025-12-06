import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadPdfHandler = (pathname) => {
  const uploadPath = `uploads/${pathname}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e99);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  function pdfFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file pdf yang diperbolehkan"), false);
    }
  }

  return multer({ storage, fileFilter: pdfFilter });
};
