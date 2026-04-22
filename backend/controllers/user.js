import User from "../models/user.js";
import { sign } from "../services/auth.js";

// ─── Google OAuth ──────────────────────────────────────────────────────────────
/**
 * POST /api/auth/google
 * Called by NextAuth's signIn callback after a successful Google OAuth flow.
 * Finds or creates the user, then issues the same JWT cookie used everywhere.
 */
export const handleGoogleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Missing Google profile data" });
    }

    // Find an existing user by email (covers both regular + Google users)
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: link googleId / avatar if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar ?? user.avatar;
        await user.save();
      }
    } else {
      // New user via Google — no password needed
      user = new User({ name, email, googleId, avatar });
      await user.save();
    }

    const payload = { id: user._id, name: user.name, email: user.email };
    const token = sign(payload);

    res.cookie("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 7 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Google auth successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Internal server error during Google auth" });
  }
};

export const handleGetCurrentUser = async (req, res) => {
  try {
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
    res.status(401).json({ message: "Not authenticated" });
  }
};

export const handleLogoutUser = async (req, res) => {
  try {
    const token = req.cookies?.Token;
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

    res.cookie("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 7 * 1000,
    });

    return res.status(200).json({
      message: "User login successful",
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
    if (userExist)
      return res.status(400).json({ message: "User Already Exits" });

    const user = new User({
      name: name,
      email: email,
    });
    await user.setPassword(password);
    await user.save();

    // Auto-login: sign a JWT and set the cookie so the user is fully
    // authenticated immediately after sign-up (same as the login flow).
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = sign(payload);
    res.cookie("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 7 * 1000,
    });

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
