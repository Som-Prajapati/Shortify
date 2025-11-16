import express, { json } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoConnector from "../config/mongo-connect.js";
import userRoute from "../routes/user.js";
import domainRoute from "../routes/domain.js";
import shortnerRoute from "../routes/shortner.js";
import redirectRoute from "../routes/redirect.js";
import { authMiddleware } from "../middlewares/auth.js";
import cors from "cors";

dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT || 3000;

// global midddlewares
app.use("/api", cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route middlewares
app.use("/api", userRoute);
app.use("/api/domain", authMiddleware, domainRoute);
app.use("/api/shortner", authMiddleware, shortnerRoute);
// //TODO! work on below routes
// app.use("/", redirectRoute);

// connect DB
mongoConnector()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Listening at PORT : " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error in DB connetion : ", err);
  });
