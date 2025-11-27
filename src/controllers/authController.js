import pool from "../models/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { loginSchema } from "../utils/validation.js";

export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "fail",
        message: parsed.error.flatten().fieldErrors,
      });
    }
    const { email: emailUser, password } = req.body;
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [emailUser],
    };

    const isUserExist = await pool.query(query);

    if (isUserExist.rowCount === 0) {
      return res.status(401).json({
        status: "fail",
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

    const {
      id,
      email,
      role,
      full_name,
      nim,
      phone,
      username,
      url_photo
    } = user;

    const token = generateToken({
      id,
      email,
      role,
    });

    return res.status(200).json({
      status: "success",
      message: "Login berhasil dilakukan",
      accessToken: token,
      user: {
        id,
        email,
        role,
        full_name,
        nim,
        phone,
        username,
        url_photo
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
