import { uploadPdfHandler } from "../utils/uploadHandler.js";
import pool from "../models/db.js";
import { findUserIdFromRequest } from "./requestController.js";
import { nanoid } from "nanoid";

const upload = uploadPdfHandler("request");

export const uploadRequestController = async (req, res) => {
  try {
    const uploadSingle = () =>
      new Promise((resolve, reject) => {
        upload.single("file")(req, res, (err) => {
          if (err) reject(err);
          else resolve(req.file);
        });
      });

    const file = await uploadSingle();

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "tidak ada file yang diupload",
      });
    }

    const filePath = `http://localhost:${process.env.PORT}/upload/request/${file.filename}`;

    const { role, id: authenticateUser } = req.user;
    const { id } = req.params;
    const ownerId = await findUserIdFromRequest(id);

    if (role !== "admin" && authenticateUser !== ownerId) {
      return res.status(401).json({
        status: "fail",
        message: "Anda tidak berhak mengakses resource ini",
      });
    }

    const idUrl = `url_req_${nanoid(10)}`;

    const query = {
      text: "INSERT INTO url_req (id, url, req_id) VALUES ($1, $2, $3) RETURNING id",
      values: [idUrl, filePath, id],
    };

    await pool.query(query);

    return res.status(200).json({
      status: "success",
      message: "upload berhasil",
      url: filePath,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server",
    });
  }
};
