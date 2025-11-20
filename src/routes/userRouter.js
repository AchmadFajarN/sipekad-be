import express from "express";
import {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const userRouter = express.Router();
userRouter.get("/", authenticate, getAllUser);
userRouter.get("/:id", authenticate, getUserById);
userRouter.put("/:id", authenticate, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);

export default userRouter;
