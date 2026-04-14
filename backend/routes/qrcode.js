import express from "express";
import {
  handleCreateQrcode,
  handleDeleteQrcode,
  handleGetAllQrcodes,
} from "../controllers/qrcode.js";

const router = express.Router();

router.post("/create", handleCreateQrcode);
router.get("/all", handleGetAllQrcodes);
router.delete("/:id", handleDeleteQrcode);

export default router;
