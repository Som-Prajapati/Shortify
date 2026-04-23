"use client";

import { useSession, signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";

export function useAuth() {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      await api.get("/auth/check");
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: check if user has valid backend session
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // When NextAuth session changes AND we're not already logged in,
  // sync to backend (handles Google OAuth flow)
  useEffect(() => {
    if (status === "authenticated" && session?.user && !isLoggedIn) {
      syncSessionToBackend();
    }
  }, [status, session?.user?.email]); // Use email as stable key

  const syncSessionToBackend = async () => {
    try {
      if (!session?.user) return;

      await api.post("/auth/google", {
        name: session.user.name,
        email: session.user.email,
        googleId: (session.user as any).id,
        avatar: session.user.image,
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Failed to sync session:", err);
      // Sync failed—clean up NextAuth session
      await signOut({ redirect: false });
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      // 1. Clear backend session (removes JWT cookie)
      await api.get("/auth/logout");
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      // 2. Always clear NextAuth session (removes NextAuth token)
      // This happens regardless of backend success
      await signOut({ redirect: false });
      setIsLoggedIn(false);
    }
  }, []);

  return {
    isLoggedIn,
    loading,
    session,
    logout,
    status,
    refreshAuth: checkAuth,
  };
}
