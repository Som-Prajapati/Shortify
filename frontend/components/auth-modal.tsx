"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRegister, handleLogin } from "@/services/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
  onSuccess: () => void;
}

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
  const [error, setError] = useState("");

  // Email & password validation (live)
  useEffect(() => {
    // Email validation
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email format");
        return;
      } else {
        setError("");
      }
    }

    // Password length validation
    if (password.length > 0 && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Password match (signup only)
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

    // Final validations
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

      onSuccess();
      setEmail("");
      setPassword("");
      setRetypePassword("");
      setName("");
    } catch (err: any) {
      // Validation errors from backend (express-validator)
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
      </div>
    </div>
  );
}
