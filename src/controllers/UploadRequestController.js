import pool from "../models/db.js";
import { nanoid } from "nanoid";
import { uploadToS3 } from "../utils/uploadS3.js";
import { findUserIdFromRequest } from "./requestController.js";

export const uploadRequestController = async (req, res) => {
  try {
    const { role, id: userAuthenticate } = req.user;
    const { id: reqId } = req.params;
    const file = req.file;
    const url = await uploadToS3(file.path, file.originalname, file.mimetype);

    const userOwner = await findUserIdFromRequest(reqId);

    if (role !== "admin" && userAuthenticate !== userOwner) {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    const idUrl = `urlReq-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO url_req (id, url, req_id) VALUES ($1, $2, $3) RETURNING url",
      values: [idUrl, url, reqId],
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
