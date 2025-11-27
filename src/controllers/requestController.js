import pool from "../models/db.js";
import { nanoid } from "nanoid";
import { postRequestSchema } from "../utils/validation.js";

export const getAllPengajuan = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const query = {
      text: `SELECT r.*
             FROM requests as r
             ORDER BY r.updated_at DESC`,
    };

    const result = await pool.query(query);
    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const getPengajuanByUserId = async (req, res) => {
  try {
    const { role, id: authenticatedUser } = req.user;
    const { id } = req.params;

    if (role !== "admin" && authenticatedUser !== id) {
      return res.status(400).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const query = {
      text: "SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC",
      values: [id],
    };
    const result = await pool.query(query);
    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const findUserIdFromRequest = async (requestId) => {
  const query = {
    text: "SELECT user_id FROM requests WHERE id = $1",
    values: [requestId],
  };

  const result = await pool.query(query);
  if (!result.rowCount) {
    return res.status(404).json({
      status: "fail",
      message: "pengajuan dengan id tersebut tidak ditemukan",
    });
  }

  return result.rows[0].user_id;
};

export const getPengajuanDetail = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const { id: userId, role } = req.user;

    const userOwner = findUserIdFromRequest(requestId);
    if (role !== "admin" && userId !== userOwner) {
      return res.status(400).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const query = {
      text: `SELECT 
      r.*, 
      users.username, 
      users.url_photo,
      users.nim,
      url_req.url
      FROM requests AS r
      LEFT JOIN users ON users.id = r.user_id
      LEFT JOIN url_req ON req_id = r.id
      WHERE r.id = $1`,
      values: [requestId],
    };

    const result = await pool.query(query);
    return res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const tambahPengajuan = async (req, res) => {
  try {
    const id = `pengajuan-${nanoid(10)}`;
    const createdAt = new Date();
    const { id: userId } = req.user;

    const parsed = postRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: parsed.error.flatten().fieldErrors,
      });
    }

    const { message, type } = parsed.data;
    const queue = type
      .replace(/[aeiou]/gi, "")
      .replace(/\s+/g, "")
      .toUpperCase();
    const full_queue = `${queue}-${Math.floor(Math.random(20))}`;

    const query = {
      text: `INSERT INTO requests (id, user_id, type, queue, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
      values: [id, userId, type, full_queue, message, createdAt],
    };

    await pool.query(query);

    return res.status(200).json({
      status: "success",
      message: "pengajuan berhasil ditambahkan",
      pengajuanId: id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const cancelStatusPengajuan = async (req, res) => {
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
      text: `UPDATE requests SET status = $1 WHERE id = $2 RETURNING id`,
      values: ["canceled", id],
    };

    const result = await pool.query(query);

    if (!result.rowCount) {
      return res.status(404).json({
        status: "fail",
        message: "request dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `status request dengan id ${id} berhasil di cancel`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const hapusPengajuan = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;

    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses ini",
      });
    }

    const query = {
      text: "DELETE FROM requests WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return res.status(404).json({
        status: "fail",
        message: "pengajuan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "pengajuan berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};
