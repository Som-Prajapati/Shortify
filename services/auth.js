import jwt from "jsonwebtoken";

export const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m" });
};

export const verify = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log("Token verification error : ", err);
  }
};
