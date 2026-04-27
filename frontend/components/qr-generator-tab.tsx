"use client";

import React, { useState } from "react";
import { ColorSelector } from "@/components/color-selector";
import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Download, QrCode, Zap, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { generateQRImage } from "@/lib/qr-generator";
import { createQRCode, getLogoUploadUrl } from "@/services/qrcode";

interface QRGeneratorTabProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

export default function QRGeneratorTab({
  isLoggedIn,
  onLoginRequired,
}: QRGeneratorTabProps) {
  const [qrInput, setQrInput] = useState("");
  const [qrType, setQrType] = useState("url");
  const [qrSize, setQrSize] = useState("250");
  const [qrColor, setQrColor] = useState("#000000");
  const [logoType, setLogoType] = useState<"none" | "emoji" | "logo">("none");
  const [logoValue, setLogoValue] = useState<string | File>("");
  const [logoImagePath, setLogoImagePath] = useState("");
  const [generatedQRUrl, setGeneratedQRUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateQR = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!qrInput) {
      toast.error("Please enter content to generate QR code");
      return;
    }

    setLoading(true);

    try {
      let finalLogoValue = logoValue;
      let currentLogoPath = logoImagePath;

      // --- STEP 1: R2 UPLOAD (Only if it's a new file) ---
      if (logoType === "logo" && logoValue instanceof File) {
        toast.info("Uploading logo to cloud...");

        // Get signature from your Express backend
        const { uploadUrl, imageUrl } = await getLogoUploadUrl(
          logoValue.name,
          logoValue.type,
        );

        // Direct PUT to Cloudflare R2
        await fetch(uploadUrl, {
          method: "PUT",
          body: logoValue,
          headers: { "Content-Type": logoValue.type },
        });

        // Update values for MongoDB and Canvas
        finalLogoValue = imageUrl;
        currentLogoPath = imageUrl;

        // Sync local state so regeneration doesn't re-upload
        setLogoValue(imageUrl);
        setLogoImagePath(imageUrl);
      } else if (logoType === "logo" && typeof logoValue === "string") {
        // Already uploaded - use existing URL
        finalLogoValue = logoValue;
        currentLogoPath = logoImagePath || logoValue;
      }

      // --- STEP 2: FORMAT CONTENT ---
      let formattedContent = qrInput.trim();
      if (qrType === "email" && !formattedContent.startsWith("mailto:")) {
        formattedContent = `mailto:${formattedContent}`;
      } else if (qrType === "phone" && !formattedContent.startsWith("tel:")) {
        formattedContent = `tel:${formattedContent}`;
      } else if (qrType === "url" && !/^https?:\/\//i.test(formattedContent)) {
        formattedContent = `https://${formattedContent}`;
      }

      // --- STEP 3: SAVE TO MONGODB ---
      await createQRCode({
        type: qrType,
        size: Number(qrSize),
        content: formattedContent,
        color: qrColor,
        logoType: logoType === "logo" ? "image" : logoType, // Mapping 'logo' to 'image' for backend
        logoValue: typeof finalLogoValue === "string" ? finalLogoValue : "",
      });

      // --- STEP 4: GENERATE CANVAS PREVIEW ---
      const qrDataUrl = await generateQRImage({
        text: formattedContent,
        qrSize,
        qrColor,
        logoType: logoType === "logo" ? "image" : logoType,
        logoValue:
          logoType === "emoji" && typeof logoValue === "string"
            ? logoValue
            : "",
        logoImagePath: currentLogoPath, // Uses DataURL (fast) or R2 URL
      });

      setGeneratedQRUrl(qrDataUrl);
      toast.success("QR Code Ready!");
      window.dispatchEvent(new Event("qrCreated"));
    } catch (error: any) {
      console.error(error);
      toast.error("Process failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedQRUrl) return;

    const link = document.createElement("a");
    link.href = generatedQRUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code Downloaded!");
  };

  const handleCopy = async () => {
    try {
      if (generatedQRUrl) {
        const response = await fetch(generatedQRUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        toast.success("QR Image Copied to Clipboard!");
      } else {
        await navigator.clipboard.writeText(qrInput);
        toast.success("Link/Text Copied!");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
      toast.error("Failed to copy image to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl border border-border/50 p-6 sm:p-8 md:p-10 max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Generate QR Code
          </h3>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap justify-center items-center gap-12 text-center">
            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Content Type
              </label>
              <Select
                value={qrType}
                onValueChange={(val) => {
                  setQrType(val);
                  setGeneratedQRUrl("");
                }}
              >
                <SelectTrigger className="text-xs sm:text-sm h-11 sm:h-10 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem
                    value="url"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    URL
                  </SelectItem>
                  <SelectItem
                    value="text"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Text
                  </SelectItem>
                  <SelectItem
                    value="email"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Email
                  </SelectItem>
                  <SelectItem
                    value="phone"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Phone
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                QR Code Size
              </label>
              <Select
                value={qrSize}
                onValueChange={(val) => {
                  setQrSize(val);
                  setGeneratedQRUrl("");
                }}
              >
                <SelectTrigger className="text-xs sm:text-sm h-11 sm:h-10 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem
                    value="150"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Small (150px)
                  </SelectItem>
                  <SelectItem
                    value="250"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Medium (250px)
                  </SelectItem>
                  <SelectItem
                    value="500"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Large (500px)
                  </SelectItem>
                  <SelectItem
                    value="1000"
                    className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10"
                  >
                    Extra Large (1000px)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                QR Color
              </label>
              <ColorSelector
                value={qrColor}
                onChange={(color) => {
                  setQrColor(color);
                  setGeneratedQRUrl("");
                }}
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Center Style
              </label>
              <IconPicker
                value={{
                  type: logoType,
                  value:
                    logoType === "emoji" && typeof logoValue === "string"
                      ? logoValue
                      : logoImagePath,
                  imagePath: logoImagePath,
                }}
                onChange={(val) => {
                  setLogoType(val.type);
                  // val.value can be a File (for logo) or string (for emoji)
                  setLogoValue(val.value || "");
                  setLogoImagePath(val.imagePath || "");
                  setGeneratedQRUrl("");
                }}
                className="h-11 sm:h-10 [&>button]:h-full"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
              {qrType === "url"
                ? "URL"
                : qrType === "email"
                  ? "Email Address"
                  : qrType === "phone"
                    ? "Phone Number"
                    : "Text"}
            </label>
            <Input
              type={qrType === "url" ? "url" : "text"}
              placeholder={
                qrType === "url"
                  ? "https://example.com"
                  : qrType === "email"
                    ? "name@example.com"
                    : qrType === "phone"
                      ? "+1 234 567 8900"
                      : "Enter your text..."
              }
              value={qrInput}
              onChange={(e) => {
                setQrInput(e.target.value);
                setGeneratedQRUrl("");
              }}
              className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGenerateQR();
                }
              }}
            />
          </div>

          {generatedQRUrl && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 sm:p-8 rounded-lg border border-primary/20 backdrop-blur-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <p className="text-xs sm:text-sm font-semibold text-foreground/70 mb-6">
                Your QR Code:
              </p>
              <div className="relative mb-6">
                <div
                  className="bg-white p-2 rounded-lg border-4 border-gradient-to-r from-primary to-secondary shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center"
                  style={{
                    width: Number(qrSize) + 20 + "px",
                    height: Number(qrSize) + 20 + "px",
                  }}
                >
                  <img
                    src={generatedQRUrl}
                    alt="Generated QR Code"
                    width={qrSize}
                    height={qrSize}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row w-full">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 btn-smooth rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground h-10 sm:h-11 transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy QR Image
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1 btn-smooth rounded-lg border-2 border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 hover:text-foreground  h-10 sm:h-11 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerateQR}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90  hover:border-foreground/50 hover:to-secondary/90 py-4 sm:py-5 md:py-6 btn-smooth text-sm sm:text-base rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {generatedQRUrl ? "Regenerate QR Code" : "Generate QR Code"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
