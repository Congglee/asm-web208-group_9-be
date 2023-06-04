import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Product
import productRoute from "./routers/product";
dotenv.config();

import userRoute from "./routers/user";
import categoryRoute from "./routers/category";

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api", userRoute);
app.use("/api", categoryRoute);

app.use("/api/product", productRoute);
mongoose.connect(
  "mongodb+srv://congltph27602:congltph27602@asm-web208.6mtrvgz.mongodb.net/asm-web208-g7"
);

export const viteNodeApp = app;
