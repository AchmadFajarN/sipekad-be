import { getSummeryData, getDistribusiPengajuan, getTopRequestTypes, getStatusPengajuan } from "../controllers/dashboardController.js";
import express from "express";
import { authenticate } from "../middlewares/auth.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/summery", authenticate, getSummeryData);
dashboardRouter.get("/distribusi-pengajuan", authenticate, getDistribusiPengajuan);
dashboardRouter.get("/top-pengajuan", authenticate, getTopRequestTypes)
dashboardRouter.get("/status-pengajuan", authenticate, getStatusPengajuan)

export default dashboardRouter;
