import express from "express";
import {
  register,
  login,
  logOut,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/UserController";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/users/register", register);
router.post("/users/login", login);
router.post("/users/logOut", logOut);

router.get("/users", [verifyAccessToken, isAdmin], getUsers);
router.get("/users/:id", verifyAccessToken, getUser);

router.put("/users/:id", verifyAccessToken, updateUser);
router.delete("/users/:id", [verifyAccessToken, isAdmin], deleteUser);

export default router;
