import User from "../models/user.js";
import { sign } from "../services/auth.js";

export const handleLogoutUser = async (req, res) => {
  try {
    const token = req.cookies?.Token;
    if (!token) return res.status(200).json("Already Logged out");

    res.clearCookie("Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json("Logged out Sucessfully");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in Logging out user" });
  }
};

export const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "User doesnt Exits" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Wrong Password" });
    console.log(user);
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = sign(payload);

    //TODO cookie age is just 1m for testng
    res.cookie("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 1000,
    });

    return res.status(200).json({
      message: "User loggin successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in Logging in User" });
  }
};

export const handleRegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findUserByEmail(email);
    if (userExist) return res.status(400).json({ message: "User Exits" });

    const user = new User({
      name: name,
      email: email,
    });
    await user.setPassword(password);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in Registering User" });
  }
};
