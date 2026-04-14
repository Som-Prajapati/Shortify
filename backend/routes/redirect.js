import express from "express";
import { handleRedirect } from "../controllers/shortner-lookup.js";

const router = express.Router();

router.get("/:shortId", handleRedirect);

export default router;
