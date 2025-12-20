import {
  getSummeryData,
  getDistribusiPengajuan,
  getTopRequestTypes,
  getStatusPengajuan,
  getSummeryByUserId,
} from "../controllers/dashboardController.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summery", authenticate, getSummeryData);
dashboardRouter.get(
  "/distribusi-pengajuan",
  authenticate,
  getDistribusiPengajuan
);
dashboardRouter.get("/top-pengajuan", authenticate, getTopRequestTypes);
dashboardRouter.get("/status-pengajuan", authenticate, getStatusPengajuan);
dashboardRouter.get("/summery/:id", authenticate, getSummeryByUserId);

export default dashboardRouter;
