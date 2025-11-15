import express from "express";
import { storeDomainValidationRules } from "../validators/domain.js";
import { validate } from "../middlewares/validate.js";
import {
  handleFetchDomains,
  handleStoreDomains,
  handleVerifyDomain,
  handleDeleteDomains,
} from "../controllers/domain.js";

const router = express.Router();

router.post("/", storeDomainValidationRules(), validate, handleStoreDomains);
router.get("/", handleFetchDomains);

// .get(handleFetchDomains);

router.patch("/:id/verify", handleVerifyDomain);

router.delete("/:id", handleDeleteDomains);

export default router;
