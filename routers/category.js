import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/CategoryController";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);

router.post("/categories", [verifyAccessToken, isAdmin], createCategory);
router.put("/categories/:id", [verifyAccessToken, isAdmin], updateCategory);

router.delete("/categories/:id", [verifyAccessToken, isAdmin], deleteCategory);

export default router;
