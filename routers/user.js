import express from "express";
const router = express.Router();
import {
  register,
  login,
  logOut,
  getUserId,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/UserController";

router.post("/register", register);
router.post("/login", login);
router.post("/logOut", logOut);
router.get("/getAllUsers", getAllUsers);
router.get("/:id/getUser", getUserId);
router.put("/:id/updateUser", updateUser);
router.delete("/:id/deleteUser", deleteUser);

export default router;
