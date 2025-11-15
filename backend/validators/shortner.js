import { body } from "express-validator";

export const storeShortnerValidationRules = () => [
  //domain name
  body("domain").trim().notEmpty().withMessage("Domain name empty"),
  // shortID
  body("shortId").trim().notEmpty().withMessage("shortId name empty"),
  //originalUrl
  body("originalUrl")
    .trim()
    .notEmpty()
    .withMessage("originalURL name empty")
    .isURL()
    .withMessage("Provide a corrrect url "),
];

export const toggleIsActiveValidationRules = () => [
  //IsActive
  body("isActive").isBoolean().withMessage("Not a boolean value"),
];
