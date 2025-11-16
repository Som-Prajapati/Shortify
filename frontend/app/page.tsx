"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import AuthModal from "@/components/auth-modal";
import Hero from "@/components/hero";
import MainTools from "@/components/main-tools";
import OneStopSolution from "@/components/one-stop-solution";
import Features from "@/components/features";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";
import api from "@/lib/api";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await api.get("/auth/check");
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onAuthClick={handleAuthClick}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={() => {
          setIsLoggedIn(true);
          setIsAuthOpen(false);
        }}
      />
      <main>
        <MainTools
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => handleAuthClick("signup")}
        />
        <Hero onGetStarted={() => handleAuthClick("signup")} />
        <OneStopSolution />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
