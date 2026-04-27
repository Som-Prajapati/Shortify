import express from "express";
import {
  handleCreateQrcode,
  handleDeleteQrcode,
  handleGetAllQrcodes,
} from "../controllers/qrcode.js";
import { handleGetUploadUrl } from "../controllers/logos.js";

const router = express.Router();

router.post("/create", handleCreateQrcode);
router.get("/all", handleGetAllQrcodes);
router.delete("/:id", handleDeleteQrcode);
router.post("/upload-url", handleGetUploadUrl);

export default router;
