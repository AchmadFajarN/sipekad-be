import express from "express";
import {
  addUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const userRouter = express.Router();
userRouter.post("/", authenticate, addUser);
userRouter.get("/", authenticate, getAllUser);
userRouter.get("/:id", authenticate, getUserById);
userRouter.put("/:id", authenticate, updateUser);
userRouter.delete("/:id", authenticate, deleteUser);

export default userRouter;
