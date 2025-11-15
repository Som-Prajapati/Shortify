import express from "express";
import {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
} from "../controllers/user.js";
import {
  registerValidationRules,
  loginValidationRules,
} from "../validators/user.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/auth/register",
  registerValidationRules(),
  validate,
  handleRegisterUser
);

router.post("/auth/login", loginValidationRules(), validate, handleLoginUser);

router.get("/auth/logout", handleLogoutUser);

export default router;
