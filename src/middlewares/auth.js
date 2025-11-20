import { verifyToken } from "../utils/token.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.header.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Anda tidak berhak mengakses resource ini",
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      status: "fail",
      message: "token invalid atau expired",
    });
  }

  req.user = payload;
  next();
};
