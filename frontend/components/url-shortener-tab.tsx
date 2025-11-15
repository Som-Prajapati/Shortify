"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, AlertCircle, Link2, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedDomain, setSelectedDomain] = useState("short.link");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const domains = ["short.link", "link.me", "go.to", "custom-domain-1.com"];

  useEffect(() => {
    if (!customShortId) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    const timer = setTimeout(() => {
      setAvailable(Math.random() > 0.3);
      setChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [customShortId]);

  const handleCreateShortener = () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!originalUrl) {
      alert("Please enter a URL to shorten");
      return;
    }

    const shortId = customShortId || Math.random().toString(36).substr(2, 6);
    setShortenedUrl(`${selectedDomain}/${shortId}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
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
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Domain
              </label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
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
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Custom Short ID (Optional)
              </label>
              <div className="relative">
                <Input
                  placeholder="my-link"
                  value={customShortId}
                  onChange={(e) => setCustomShortId(e.target.value)}
                  className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm pr-12"
                />
                {customShortId && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking ? (
                      <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : available ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {customShortId && (
                <p
                  className={`text-xs mt-2.5 font-medium transition-colors duration-300 ${
                    checking
                      ? "text-blue-500/70"
                      : available
                      ? "text-green-500/70"
                      : "text-red-500/70"
                  }`}
                >
                  {checking
                    ? "Checking availability..."
                    : available
                    ? "Available!"
                    : "Not available"}
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

          {shortenedUrl && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-5 sm:p-6 rounded-lg border border-primary/20 backdrop-blur-sm">
              <p className="text-xs sm:text-sm font-semibold text-foreground/70 mb-3">
                Your shortened URL:
              </p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Input
                  readOnly
                  value={shortenedUrl}
                  className="bg-card/60 text-xs sm:text-sm rounded-lg border border-primary/20 font-mono text-primary"
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="px-4 sm:px-5 btn-smooth flex-shrink-0 rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 h-10 sm:h-11 transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleCreateShortener}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 py-4 sm:py-5 md:py-6 btn-smooth text-sm sm:text-base rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Create Short URL
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
