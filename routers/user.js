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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logOut", logOut);
router.get("/getAllUsers", getUsers);
router.get("/:id/getUser", getUser);
router.put("/:id/updateUser", updateUser);
router.delete("/:id/deleteUser", deleteUser);

export default router;
