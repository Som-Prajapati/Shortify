import express, { json } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoConnector from "../config/mongo-connect.js";
import userRoute from "../routes/user.js";
import domainRoute from "../routes/domain.js";
import shortnerRoute from "../routes/shortner.js";
import redirectRoute from "../routes/redirect.js";

dotenv.config();

// constants
const app = express();
const PORT = process.env.PORT || 3000;

// global midddlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route middlewares
app.use("/api", userRoute);
// //TODO! work on below routes
// app.use("/api/domain", domainRoute);
// app.use("/api/shortner", shortnerRoute);
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
