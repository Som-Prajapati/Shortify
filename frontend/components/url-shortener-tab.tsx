"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, AlertCircle, Link2, Zap, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createShortUrl,
  checkAvailability,
  fetchDomains,
} from "@/services/shortner";

interface URLShortenerTabProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onAddDomain: () => void;
}

export default function URLShortenerTab({
  isLoggedIn,
  onLoginRequired,
  onAddDomain,
}: URLShortenerTabProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortId, setCustomShortId] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);

  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch domains from the API when the user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch domains
    setLoadingDomains(true);
    fetchDomains()
      .then((data) => {
        const names: string[] = (data.domainList ?? []).map(
          (d: { name: string }) => d.name,
        );
        // Fall back to localhost
        const finalNames = names.length > 0 ? names : [];
        setDomains(finalNames);
        setSelectedDomain(finalNames[0]);
      })
      .catch(() => {
        setDomains([]);
        setSelectedDomain("");
      })
      .finally(() => setLoadingDomains(false));
  }, [isLoggedIn]);

  // Real availability check — debounced 500 ms
  useEffect(() => {
    if (!customShortId || !selectedDomain) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const data = await checkAvailability(selectedDomain, customShortId);
        setAvailable(data.available);
      } catch {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customShortId, selectedDomain]);

  const handleCreateShortener = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!originalUrl) {
      setError("Please enter a URL to shorten.");
      return;
    }

    if (!selectedDomain) {
      setError("Please select a domain first.");
      return;
    }

    if (customShortId && available === false) {
      setError("That short ID is already taken. Please choose another.");
      return;
    }

    const shortId = customShortId || Math.random().toString(36).substring(2, 8);

    setError(null);
    setSubmitting(true);
    try {
      await createShortUrl(selectedDomain, shortId, originalUrl);
      setShortenedUrl(`${selectedDomain}/${shortId}`);
      setOriginalUrl("");
      setCustomShortId("");
      setAvailable(null);

      // Trigger a custom event to notify other components (e.g. user-history)
      window.dispatchEvent(new Event("shortenerCreated"));
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status: number; data?: { message?: string } };
      };
      if (axiosErr?.response?.status === 409) {
        setError("That short ID is already taken for this domain.");
      } else {
        setError(
          axiosErr?.response?.data?.message ??
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Section */}
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl border border-border/50 p-6 sm:p-8 md:p-10 max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
            <Link2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Shorten Your URL
          </h3>
        </div>

        <div className="space-y-5">
          <div className="group">
            <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
              Original URL
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={originalUrl}
                onChange={(e) => {
                  setOriginalUrl(e.target.value);
                  setError(null);
                }}
                className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Domain
              </label>
              {loadingDomains ? (
                <div className="flex items-center gap-2 h-11 px-3 rounded-lg border-2 border-border/50 text-xs text-foreground/50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading…
                </div>
              ) : domains.length === 0 ? (
                <div className="flex items-center h-11 px-3 rounded-lg border-2 border-dashed border-border/50 text-xs text-foreground/40 italic">
                  No domains yet
                </div>
              ) : (
                <Select
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                >
                  <SelectTrigger className="text-xs sm:text-sm h-11 sm:h-10 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    {domains.map((domain) => (
                      <SelectItem
                        key={domain}
                        value={domain}
                        className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                      >
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Custom Short ID (Optional)
              </label>
              <div className="relative">
                <Input
                  placeholder="my-link"
                  value={customShortId}
                  onChange={(e) => {
                    setCustomShortId(e.target.value);
                    setError(null);
                  }}
                  className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm pr-12"
                />
                {customShortId && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking ? (
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : available === true ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : available === false ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {customShortId && (
                <p
                  className={`text-xs mt-2.5 font-medium transition-colors duration-300 ${
                    checking
                      ? "text-blue-500/70"
                      : available === true
                        ? "text-green-500/70"
                        : available === false
                          ? "text-red-500/70"
                          : "text-foreground/40"
                  }`}
                >
                  {checking
                    ? "Checking availability…"
                    : available === true
                      ? "Available!"
                      : available === false
                        ? "Not available"
                        : ""}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => onAddDomain()}
              variant="outline"
              className="w-full btn-smooth text-xs sm:text-sm h-10 sm:h-11 rounded-lg border-2 border-border/50 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300"
            >
              + Add Custom Domain
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleCreateShortener}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 py-4 sm:py-5 md:py-6 btn-smooth text-sm sm:text-base rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden disabled:opacity-60"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              )}
              {submitting ? "Creating…" : "Create Short URL"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
