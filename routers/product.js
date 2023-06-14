import express from "express";
import {
  getProduct,
  getProducts,
  getProductsClient,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductBySlug,
} from "../controllers/ProductController";
import uploadCloud from "../config/cloudinary.config";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/products",
  [verifyAccessToken, isAdmin],
  uploadCloud.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProduct
);

router.get("/products", getProducts);
router.get("/products/id/:id", [verifyAccessToken, isAdmin], getProduct);
router.get("/products/id/:id", getProduct);
router.get("/products/slug/:slug", getProductBySlug);
router.get("/product", getProductsClient);

router.put(
  "/products/:id",
  [verifyAccessToken, isAdmin],
  uploadCloud.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProduct
);

router.delete("/products/:id", [verifyAccessToken, isAdmin], deleteProduct);

export default router;
