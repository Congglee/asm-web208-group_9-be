import express from "express";
import {
  getProduct,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../controllers/ProductController";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/products", [verifyAccessToken, isAdmin], createProduct);

router.get("/products", getProducts);
router.get("/products/:id", getProduct);

router.put("/products/:id", [verifyAccessToken, isAdmin], updateProduct);
router.delete("/products/:id", [verifyAccessToken, isAdmin], deleteProduct);

export default router;
