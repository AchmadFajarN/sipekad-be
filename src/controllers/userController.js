import pool from "../models/db.js";
import { updateUserSchema } from "../utils/validation.js";

export const getAllUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "Anda tidak berhak mengakses resource ini",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT (*) FROM users';
    const countResult = await pool.query(countQuery);
    const totalData = parseInt(countResult.rows[0].count);
    const totalPage = Math.ceil(totalData/limit);

    const query = {
      text: `SELECT id, username, nim, role, full_name, email, phone, url_photo 
             FROM users
             ORDER BY username
             LIMIT $1 OFFSET $2`,
      values: [limit, offset]
    }


    const result = await pool.query(query);
    res.json({
      status: "success",
      page,
      limit,
      totalData,
      totalPage,
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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userAuthenticate } = req.user;

    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    // if (role !== "admin" || userAuthenticate !== id) {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "Anda tidak berhak mengakses resource ini",
    //   });
    // }

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "user dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, full_name, email, phone, url_photo } = req.body;
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: parsed.error.flatten().fieldErrors,
      });
    }
    const { role, id: userAuthenticate } = req.params;

    if (role !== "admin" && userAuthenticate !== id) {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini",
      });
    }

    const query = {
      text: "UPDATE users SET username = $1, full_name = $2, email = $3, phone = $4, url_photo = $5 WHERE id = $6 RETURNING id",
      values: [username, full_name, email, phone, url_photo, id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "user dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data berhasil diupdate",
      userId: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "Anda tidak berhak mengakses resource ini",
      });
    }

    const { id } = req.params;
    const query = {
      text: "DELETE FROM users WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await pool.query(query);
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "user dengan id tersebut tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "user berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
