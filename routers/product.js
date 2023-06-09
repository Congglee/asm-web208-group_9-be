import express from "express";
import {
  getProduct,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductBySlug,
  uploadImagesProducts,
} from "../controllers/ProductController";
import uploadCloud from "../config/cloudinary.config";
import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken";

const router = express.Router();

// router.post("/products", createProduct);
// router.post("/products", uploadCloud.array("images", 10), createProduct);

router.post(
  "/products",
  uploadCloud.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProduct
);

router.get("/products", getProducts);
router.get("/products/id/:id", getProduct);
router.get("/products/slug/:slug", getProductBySlug);

router.put(
  "/products/:id",
  uploadCloud.fields([
    { name: "thumb", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProduct
);
// router.put(
//   "/products/uploadimage/:id",
//   uploadCloud.array("images", 10),
//   uploadImagesProducts
// );

router.delete("/products/:id", deleteProduct);

export default router;
