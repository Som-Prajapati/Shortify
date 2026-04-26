// app/page.tsx
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
import { fetchDomains } from "@/services/shortner";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [domains, setDomains] = useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const loading = status === "loading";

  useEffect(() => {
    if (!isLoggedIn) {
      setDomains([]);
      setLoadingDomains(false);
      return;
    }

    setLoadingDomains(true);
    fetchDomains()
      .then((data) => {
        const names: string[] = (data?.domainList ?? []).map(
          (d: { name: string }) => d.name,
        );
        setDomains(names);
      })
      .catch(() => {
        setDomains([]);
      })
      .finally(() => {
        setLoadingDomains(false);
      });
  }, [isLoggedIn]);
  const handleLogout = async () => {
    await signOut({ redirect: false });
    setQrRefreshKey((prev) => prev + 1);
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
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={async () => {
          setIsAuthOpen(false);
        }}
      />
      <main>
        <MainTools
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => handleAuthClick("signup")}
          qrRefreshKey={qrRefreshKey}
          domains={domains}
          loadingDomains={loadingDomains}
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
