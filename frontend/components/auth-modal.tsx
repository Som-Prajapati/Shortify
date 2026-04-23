"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRegister, handleLogin } from "@/services/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
  onSuccess: () => void | Promise<void>;
}

// Google logo SVG (official brand colors)
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20"
    height="20"
    aria-hidden="true"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSuccess,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: session } = useSession();

  // If user just came back from Google OAuth redirect and we have a session, signal success
  useEffect(() => {
    if (session?.user && isOpen) {
      void onSuccess();
    }
  }, [session, isOpen, onSuccess]);

  // Email & password validation (live)
  useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email format");
        return;
      } else {
        setError("");
      }
    }

    if (password.length > 0 && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (mode === "signup") {
      if (retypePassword.length > 0 && password !== retypePassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setError("");
  }, [email, password, retypePassword, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return;
    }

    if (mode === "signup" && password !== retypePassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    try {
      if (mode === "signup") {
        await handleRegister(email, password, name);
      } else {
        await handleLogin(email, password);
      }

      await onSuccess();
      setEmail("");
      setPassword("");
      setRetypePassword("");
      setName("");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e: any) => e.msg)
          .join(", ");
        setError(validationErrors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
        prompt: "select_account", // always show account picker
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {mode === "login"
            ? "Sign in to your account to continue"
            : "Join Shortify to start creating links"}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name for signup */}
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium block mb-1">Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <Input
              type="password"
              placeholder="your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Retype password */}
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Retype Password
              </label>
              <Input
                type="password"
                placeholder="retype password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />
            </div>
          )}

          {/* Terms */}
          {mode === "signup" && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required className="rounded" />I agree to
              the terms and conditions
            </label>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Sign Up"}
          </Button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                onModeChange(mode === "login" ? "signup" : "login")
              }
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* ── OR Divider ── */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Google Sign-In Button ── */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="
            w-full flex items-center justify-center gap-3
            border border-border rounded-lg px-4 py-2.5
            bg-background hover:bg-muted
            text-sm font-medium text-foreground
            transition-all duration-200
            hover:shadow-sm active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <GoogleIcon />
          {googleLoading ? "Redirecting to Google…" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
