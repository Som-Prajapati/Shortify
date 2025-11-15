import { body, validationResult } from "express-validator";

export const storeDomainValidationRules = () => [
  //domain name
  body("domain").trim().notEmpty().withMessage("Domain name empty"),
];
