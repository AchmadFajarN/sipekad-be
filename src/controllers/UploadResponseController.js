import pool from "../models/db.js";
import { nanoid } from "nanoid";
import { uploadToS3 } from "../utils/uploadS3.js";

export const uploadResponseController = async (req, res) => {
  try {
    const { role } = req.user;
    const { id: resId } = req.params;
    const file = req.file;

    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    
    const url = await uploadToS3(file.path, file.originalname, file.mimetype);

    const idUrl = `urlReq-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO url_res (id, url, res_id) VALUES ($1, $2, $3) RETURNING url",
      values: [idUrl, url, resId],
    };

    const result = await pool.query(query);
    return res.status(201).json({
      status: "success",
      message: "file berhasil diupload",
      url: result.rows[0].url,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
