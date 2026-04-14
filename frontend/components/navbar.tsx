"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { handleLogout } from "@/services/auth";

interface NavbarProps {
  onAuthClick: (mode: "login" | "signup") => void;
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export default function Navbar({
  onAuthClick,
  isLoggedIn,
  onLogout,
}: NavbarProps) {
  const logoutUser = async () => {
    try {
      await handleLogout();
      onLogout?.(); // tells parent to update UI
    } catch (err) {
      console.log("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 sm:w-8 h-7 sm:h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs sm:text-sm">
            S
          </div>
          <span className="font-bold text-sm sm:text-base md:text-lg hidden sm:inline">
            Shortify
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 md:gap-8">
          <a
            href="#features"
            className="text-xs sm:text-sm md:text-base hover:text-primary transition"
          >
            Features
          </a>
          <a
            href="#solution"
            className="text-xs sm:text-sm md:text-base hover:text-primary transition"
          >
            Solution
          </a>
          <a
            href="#faq"
            className="text-xs sm:text-sm md:text-base hover:text-primary transition"
          >
            FAQ
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAuthClick("login")}
                className="btn-smooth text-sm"
              >
                Login
              </Button>

              <Button
                size="sm"
                onClick={() => onAuthClick("signup")}
                className="bg-primary hover:bg-primary/90 btn-smooth text-sm"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={logoutUser}
                className="btn-smooth text-sm"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAuthClick("login")}
                className="text-xs px-2"
              >
                Login
              </Button>

              <Button
                size="sm"
                onClick={() => onAuthClick("signup")}
                className="bg-primary hover:bg-primary/90 text-xs px-2"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
