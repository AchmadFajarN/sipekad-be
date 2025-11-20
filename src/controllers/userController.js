import pool from "../models/db.js";

export const getAllUser = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "Anda tidak berhak mengakses resource ini",
      });
    }

    const result = await pool.query("SELECT * FROM users");
    res.json({
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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userAuthenticate } = req.user;

    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    if (role !== "admin" && userAuthenticate !== id) {
      return res.status(401).json({
        status: "fail",
        message: "Anda tidak berhak mengakses resource ini",
      });
    }

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
    const { username, nim, full_name, email, phone, url_photo } = req.body;
    const { role, id: userAuthenticate } = req.params;

    if (role !== "admin" && userAuthenticate !== id) {
      return res.status(401).json({
        status: "fail",
        message: "anda tidak berhak mengakses resource ini"
      })
    }
     
    const query = {
      text: "UPDATE users SET username = $1, nim = $2, full_name = $3, email = $4, phone = $5, url_photo = $6 WHERE id = $7 RETURNING id",
      values: [username, nim, full_name, email, phone, url_photo, id],
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
