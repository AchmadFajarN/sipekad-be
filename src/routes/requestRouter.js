import {
  getAllPengajuan,
  getPengajuanByUserId,
  getPengajuanDetail,
  tambahPengajuan,
  cancelStatusPengajuan,
  hapusPengajuan,
} from "../controllers/requestController.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const pengajuanRouter = express.Router();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

pengajuanRouter.get("/", authenticate, getAllPengajuan);
pengajuanRouter.get("/user/:id", authenticate, getPengajuanByUserId);
pengajuanRouter.get("/:id", authenticate, getPengajuanDetail);
pengajuanRouter.post("/", authenticate, tambahPengajuan);
pengajuanRouter.put("/cancel/:id", authenticate, cancelStatusPengajuan);
pengajuanRouter.delete("/:id", authenticate, hapusPengajuan);

export default pengajuanRouter;
