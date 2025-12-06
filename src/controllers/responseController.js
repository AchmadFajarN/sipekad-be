import pool from "../models/db.js";
import { findUserIdFromRequest } from "./requestController.js";
import {
  postResponseSchema,
  updateResponseSchema,
} from "../utils/validation.js";
import { nanoid } from "nanoid";

export const getResponseByIdRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const { role, id: authenticatedUser } = req.user;
    const ownerRequest = await findUserIdFromRequest(requestId);

    if (role !== "admin" && authenticatedUser !== ownerRequest) {
      res.status(400).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }
    const query = {
      text: `SELECT r.*, req.status 
             FROM responses AS r 
             LEFT JOIN requests AS req
             ON req.id = r.request_id 
             WHERE request_id = $1`,
             
      values: [requestId],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return res.status(404).json({
        status: "fail",
        message: "response tidak ditemukan atau admin belum meresponse",
      });
    }

    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

const updateStatusRequest = async (requestId, isComplete) => {
  try {
    let complete = isComplete ? "completed" : "canceled";
    const currentDate = new Date();

    const query = {
      text: "UPDATE requests SET status = $1, updated_at = $2 WHERE id = $3",
      values: [complete, currentDate, requestId],
    };
    await pool.query(query);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const tambahResponse = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const compare = postResponseSchema.safeParse(req.body);

    if (!compare.success) {
      return res.status(400).json({
        status: "fail",
        message: compare.error.flatten().fieldErrors,
      });
    }

    const { message, requestId, isComplete } = compare.data;
    const id = `response-${nanoid(10)}`;
    const currentDate = new Date();
    const query = {
      text: "INSERT INTO responses (id, request_id, message, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      values: [id, requestId, message, currentDate, currentDate],
    };

    const result = await pool.query(query);

    if (result.rows[0].id) {
      await updateStatusRequest(requestId, isComplete);
    }

    return res.status(201).json({
      status: "success",
      message: "response berhasil ditambahkan",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const updateResponse = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const compare = updateResponseSchema.safeParse(req.body);
    if (!compare.success) {
      return res.status(400).json({
        status: "fail",
        message: compare.error.flatten().fieldErrors,
      });
    }

    const { message, responseId } = compare.data;
    const currentDate = new Date();

    const query = {
      text: "UPDATE response SET message = $1, updated_at = $2 WHERE id = $3 RETURNING id",
      values: [message, currentDate, responseId],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return res.status(404).json({
        status: "fail",
        message: "response dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "response berhasil diupdate",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const hapusResponse = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const { id } = req.params;
    const query = {
      text: "DELETE FROM response WHERE id = $1 RETURNING Id",
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return res.status(404).json({
        status: "fail",
        message: "response dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "response berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
