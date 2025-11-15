import { body, validationResult } from "express-validator";

export const registerValidationRules = () => [
  //name
  body("name").trim().notEmpty().withMessage("Name must be provided"),

  //email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email must be provided")
    .isEmail()
    .withMessage("Invalid Email"),

  //password
  body("password")
    .trim()
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters long."),
];

export const loginValidationRules = () => [
  //email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email must be provided")
    .isEmail()
    .withMessage("Invalid Email"),

  //password
  body("password").trim().notEmpty().withMessage("Password mustn't be empty"),
];

export const logoutValidationRules = () => [];

export const validate = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) return next();

  return res.status(400).json({ errors: error.array() });
};
