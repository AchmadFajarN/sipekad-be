import {
  getResponseByIdRequest,
  tambahResponse,
  updateResponse,
  hapusResponse,
} from "../controllers/responseController.js";

import express from "express";
import { authenticate } from "../middlewares/auth.js";

const responseRouter = express.Router();

responseRouter.get("/:id", authenticate, getResponseByIdRequest);
responseRouter.post("/", authenticate, tambahResponse);
responseRouter.put("/:id", authenticate, updateResponse);
responseRouter.delete("/:id", authenticate, hapusResponse);

export default responseRouter;
