import express from "express";

import { createCate, getCate, getAllCate, createUncategorized, removeCate, updateCate } from "../controllers/category";

const router = express.Router();
router.get("/categories", getAllCate);
router.get("/categories/:id", getCate);
router.post("/categories", createCate);
router.post("/uncategorized", createUncategorized);
router.delete("/categories/:id", removeCate);
router.put("/categories/:id", updateCate);
export default router;