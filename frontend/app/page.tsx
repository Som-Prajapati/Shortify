"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import AuthModal from "@/components/auth-modal";
import Hero from "@/components/hero";
import MainTools from "@/components/main-tools";
import OneStopSolution from "@/components/one-stop-solution";
import Features from "@/components/features";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={handleAuthClick} isLoggedIn={isLoggedIn} />
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
