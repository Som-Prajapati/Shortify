"use client";

import React, { useState, useEffect } from "react";
import { Copy, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchShortenersList,
  toggleShortenerActive,
  deleteShortener,
} from "@/services/shortner";
import api from "@/lib/api";
import { toast } from "sonner";
import QRCode from "qrcode";

interface UserHistoryProps {
  activeTab: string;
}

interface Shortener {
  id: string;
  fullShortLink: string;
  originalUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

interface QRCodeDoc {
  id: string;
  type: string;
  size: number;
  content: string;
  createdAt: string;
}

export default function UserHistory({ activeTab }: UserHistoryProps) {
  const [urlHistory, setUrlHistory] = useState<Shortener[]>([]);
  const [qrHistory, setQrHistory] = useState<QRCodeDoc[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "url") {
        const data = await fetchShortenersList();
        setUrlHistory(data || []);
      } else if (activeTab === "qr") {
        const response = await api.get("/qrcode/all");
        setQrHistory(response.data || []);
      }
    } catch (err) {
      console.log("Failed to load history");
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleShortenerCreated = () => {
      if (activeTab === "url") {
        loadData();
      }
    };

    window.addEventListener("shortenerCreated", handleShortenerCreated);
    return () => {
      window.removeEventListener("shortenerCreated", handleShortenerCreated);
    };
  }, [activeTab]);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setUrlHistory((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s)),
      );
      await toggleShortenerActive(id, !currentStatus);
    } catch (err) {
      loadData(); // revert on fail
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shortURL?"))
      return;
    try {
      setUrlHistory((prev) => prev.filter((s) => s.id !== id));
      await deleteShortener(id);
      toast.success("Short URL deleted successfully");
    } catch (err) {
      loadData(); // revert on fail
      toast.error("Failed to delete short URL");
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(`http://${link}`);
    toast.success("Link Copied!");
  };

  const handleDeleteQR = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this QR Code record?"))
      return;
    try {
      setQrHistory((prev) => prev.filter((q) => q.id !== id));
      await api.delete(`/qrcode/${id}`);
      toast.success("QR Code deleted successfully");
    } catch (err) {
      loadData();
      toast.error("Failed to delete QR Code");
    }
  };

  const handleCopyQR = async (content: string, size: number) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success("QR Image Copied to Clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy QR Image");
    }
  };

  const handleViewQR = async (content: string, size: number) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });
      // Simple way to preview
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#f3f4f6;"><img src="${qrDataUrl}" style="box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); border-radius:10px;" /></div>`;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate QR for viewing");
    }
  };

  return (
    <div className="mt-16 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">
        {activeTab === "url"
          ? "Your Shortened URLs"
          : "Your Generated QR Codes"}
      </h3>

      {activeTab === "url" ? (
        <div className="space-y-3">
          {loading && urlHistory.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading history...
            </div>
          ) : urlHistory.length === 0 ? (
            <div className="text-center p-8 bg-card rounded-lg border border-border text-muted-foreground">
              No shortened URLs found. Create one above!
            </div>
          ) : (
            urlHistory.map((item) => (
              <div
                key={item.id}
                className={`bg-card rounded-lg border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${!item.isActive ? "border-border/20 bg-muted/20 opacity-70" : "border-border"}`}
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={`http://${item.fullShortLink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary mb-1 inline-block hover:underline truncate w-full"
                  >
                    {item.fullShortLink}
                  </a>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.originalUrl}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>👁️ {item.clicks} clicks</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${!item.isActive && "text-red-500 hover:text-red-600 border-red-200"}`}
                    onClick={() => handleToggleActive(item.id, item.isActive)}
                    title={item.isActive ? "Deactivate link" : "Activate link"}
                  >
                    {item.isActive ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(item.fullShortLink)}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(item.id)}
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {loading && qrHistory.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading history...
            </div>
          ) : qrHistory.length === 0 ? (
            <div className="text-center p-8 bg-card rounded-lg border border-border text-muted-foreground">
              No QR Codes found. Generate your first one above!
            </div>
          ) : (
            qrHistory.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1 truncate">
                    <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded mr-2 uppercase">
                      {item.type}
                    </span>
                    {item.content}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} • {item.size}px
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleViewQR(item.content, item.size)} title="Preview QR Image">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCopyQR(item.content, item.size)} title="Copy QR Image to Clipboard">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDeleteQR(item.id)}
                    title="Delete QR record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
