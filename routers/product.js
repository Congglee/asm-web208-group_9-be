import express from "express";

import {
  create,
  update,
  getProduct,
  getProducts,
  deleteProduct,
} from "../controllers/product";

const router = express.Router();

router.post("/", create);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);
router.put("/:id", update);

export default router;
