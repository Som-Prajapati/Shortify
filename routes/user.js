import express from "express";
import {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
} from "../controllers/user.js";
import {
  registerValidationRules,
  loginValidationRules,
  logoutValidationRules,
  validate,
} from "../validators/user.js";

const router = express.Router();

router.post(
  "/auth/register",
  registerValidationRules(),
  validate,
  handleRegisterUser
);

router.post("/auth/login", loginValidationRules(), validate, handleLoginUser);

router.post(
  "/auth/logout",
  logoutValidationRules(),
  validate,
  handleLogoutUser
);

export default router;
