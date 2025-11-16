import express from "express";
import {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleGetCurrentUser,
} from "../controllers/user.js";
import {
  registerValidationRules,
  loginValidationRules,
} from "../validators/user.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/auth/register",
  registerValidationRules(),
  validate,
  handleRegisterUser
);

router.post("/auth/login", loginValidationRules(), validate, handleLoginUser);

router.get("/auth/logout", handleLogoutUser);

router.get("/auth/check", authMiddleware, handleGetCurrentUser);

export default router;
