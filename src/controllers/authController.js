import pool from "../models/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const isUserExist = await pool.query(query);

    if (isUserExist.rowCount === 0) {
      return res.status(401).json({
        status: "success",
        message: "email atau password salah",
      });
    }

    const user = isUserExist.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        status: "fail",
        message: "email atau password salah",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      status: "success",
      message: "Login berhasil dilakukan",
      accessToken: token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
