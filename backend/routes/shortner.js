import express from "express";
import {
  handleCheckAvailability,
  handleCreateShortner,
  handleGetAnalytics,
  handleToggleIsActive,
  handleDeleteShortner,
} from "../controllers/shortner.js";
import { validate } from "../middlewares/validate.js";
import {
  storeShortnerValidationRules,
  toggleIsActiveValidationRules,
} from "../validators/shortner.js";

const router = express.Router();

router.post(
  "/",
  storeShortnerValidationRules(),
  validate,
  handleCreateShortner
);

router.get(
  "/availability",

  handleCheckAvailability
);

router.get("/:id", handleGetAnalytics);
router.patch(
  "/:id",
  toggleIsActiveValidationRules(),
  validate,
  handleToggleIsActive
);
router.delete("/:id", handleDeleteShortner);
export default router;
