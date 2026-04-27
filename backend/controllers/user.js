import User from "../models/user.js";
import { sign } from "../services/auth.js";

export const handleGoogleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Missing Google profile data" });
    }
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar ?? user.avatar;
        await user.save();
      }
    } else {
      user = new User({ name, email, googleId, avatar });
      await user.save();
    }

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = sign(payload);

    return res.status(200).json({
      message: "Google auth successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during Google auth" });
  }
};

export const handleGetCurrentUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar ?? null,
      },
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res
      .status(500)
      .json({ message: "Internal server error while fetching user" });
  }
};

export const handleLogoutUser = async (req, res) => {
  try {
    const authHeader = req.headers?.authorization || "";
    const tokenFromHeader = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = tokenFromHeader ?? req.cookies?.Token;

    if (!token) return res.status(200).json({ message: "Already Logged out" });

    res.clearCookie("Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ message: "Logged out Sucessfully" });
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
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token = sign(payload);

    return res.status(200).json({
      message: "User login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
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
    if (userExist)
      return res.status(400).json({ message: "User Already Exits" });

    const user = new User({
      name: name,
      email: email,
    });
    await user.setPassword(password);
    await user.save();

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = sign(payload);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in Registering User" });
  }
};
