"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper functions for color conversion
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

interface ColorGroup {
  name: string;
  colors: string[];
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    name: "Blues",
    colors: ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E3A8A"],
  },
  {
    name: "Cyans",
    colors: ["#67E8F9", "#22D3EE", "#06B6D4", "#0891B2", "#164E63"],
  },
  {
    name: "Teals",
    colors: ["#5EEAD4", "#2DD4BF", "#14B8A6", "#0D9488", "#134E4A"],
  },
  {
    name: "Emeralds",
    colors: ["#6EE7B7", "#34D399", "#10B981", "#059669", "#064E3B"],
  },
  {
    name: "Greens",
    colors: ["#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#14532D"],
  },
  {
    name: "Limes",
    colors: ["#BEF264", "#A3E635", "#84CC16", "#65A30D", "#365314"],
  },
  {
    name: "Yellows",
    colors: ["#FEF08A", "#FDE047", "#FACC15", "#CA8A04", "#713F12"],
  },
  {
    name: "Ambers",
    colors: ["#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#78350F"],
  },
  {
    name: "Oranges",
    colors: ["#FDBA74", "#FB923C", "#F97316", "#EA580C", "#7C2D12"],
  },
  {
    name: "Reds",
    colors: ["#FCA5A5", "#F87171", "#EF4444", "#DC2626", "#7F1D1D"],
  },
  {
    name: "Roses",
    colors: ["#FDA4AF", "#FB7185", "#F43F5E", "#E11D48", "#881337"],
  },
  {
    name: "Pinks",
    colors: ["#F9A8D4", "#F472B6", "#EC4899", "#DB2777", "#831843"],
  },
  {
    name: "Purples",
    colors: ["#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#581C87"],
  },
  {
    name: "Violets",
    colors: ["#C4B5FD", "#A78BFA", "#8B5CF6", "#7C3AED", "#4C1D95"],
  },
  {
    name: "Grays",
    colors: ["#D1D5DB", "#9CA3AF", "#6B7280", "#374151", "#111827"],
  },
  {
    name: "Browns",
    colors: ["#D6A77A", "#B08968", "#7F5539", "#5E3B2E", "#3E2723"],
  },
];

export interface ColorSelectorProps {
  value?: string;
  onChange?: (color: string) => void;
}

export function ColorSelector({
  value = "#0EA5E9",
  onChange,
}: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState(value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [opacity, setOpacity] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  };

  const updateFromHSL = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    handleColorChange(hex);
  };

  const updateFromRGB = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    handleColorChange(hex);
  };

  const updateFromHex = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      handleColorChange(hex);
    }
  };

  const handleColorAreaMove = (e: MouseEvent, rect: DOMRect) => {
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp to bounds
    x = Math.max(0, Math.min(rect.width, x));
    y = Math.max(0, Math.min(rect.height, y));

    const s = Math.round((x / rect.width) * 100);
    const l = Math.round(100 - (y / rect.height) * 100);
    updateFromHSL(hue, s, l);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    handleColorAreaMove(e.nativeEvent, rect);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleColorAreaMove(moveEvent, rect);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const rgb = hexToRgb(selectedColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-2 bg-transparent rounded-xl px-3 py-2 border-2 transition-all hover:bg-transparent hover:text-foreground "
          >
            <div
              className="h-5 w-5 rounded transition-transform"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm font-medium">Color</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-66 rounded-md border-2 bg-background p-4"
          side="right"
          align="center"
        >
          <div
            className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
          >
            {/* Color Groups Grid */}
            {COLOR_GROUPS.map((group) => (
              <div key={group.name} className="space-y-1 p-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  {group.name}
                </h3>
                <div className="flex gap-2">
                  {group.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`relative h-10 w-10 rounded transition-all hover:scale-110 hover:z-10 ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-foreground"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Divider */}
            <div className="my-3 h-px bg-border" />

            {/* More Colors Button */}
            <Button
              onClick={() => setShowColorPicker(true)}
              variant="outline"
              className="w-full rounded border-2"
            >
              <Plus className="h-4 w-4" />
              More Colors
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Advanced Color Picker Dialog */}
      <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DialogContent className="max-w-md rounded p-6">
          <DialogHeader>
            <DialogTitle>Pick a Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Color Picker Area with Vertical Bars */}
            <div className="flex gap-3">
              {/* Main Color Gradient Area */}
              <div
                className="relative flex-1 aspect-[4/3] rounded border-2 border-border overflow-hidden cursor-pointer select-none"
                onMouseDown={handleMouseDown}
                style={{
                  background: `
                    linear-gradient(to bottom, transparent, black),
                    linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
                  `,
                }}
              >
                <div
                  className="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${saturation}%`,
                    top: `${100 - lightness}%`,
                    willChange: "transform, left, top",
                    transform: `translate(-50%, -50%)`,
                    zIndex: 10,
                  }}
                />
              </div>

              {/* Vertical Hue Bar */}
              <div className="relative w-4 aspect-[1/8] rounded overflow-visible border-2 border-border cursor-pointer">
                <svg
                  className="w-full h-full rounded"
                  viewBox="0 0 20 360"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="hueGradientVertical"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="hsl(0, 100%, 50%)" />
                      <stop offset="16.67%" stopColor="hsl(60, 100%, 50%)" />
                      <stop offset="33.33%" stopColor="hsl(120, 100%, 50%)" />
                      <stop offset="50%" stopColor="hsl(180, 100%, 50%)" />
                      <stop offset="66.67%" stopColor="hsl(240, 100%, 50%)" />
                      <stop offset="83.33%" stopColor="hsl(300, 100%, 50%)" />
                      <stop offset="100%" stopColor="hsl(360, 100%, 50%)" />
                    </linearGradient>
                  </defs>
                  <rect
                    width="20"
                    height="360"
                    fill="url(#hueGradientVertical)"
                  />
                </svg>
                {/* Square selector */}
                <div
                  className="absolute left-1/2 w-5 h-5 border-2 border-white rounded pointer-events-none shadow-lg"
                  style={{
                    top: `${(hue / 360) * 100}%`,
                    backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    willChange: "transform, top",
                    transform: "translate(-50%, -50%)",
                    zIndex: 20,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) =>
                    updateFromHSL(Number(e.target.value), saturation, lightness)
                  }
                  className="absolute inset-0 w-full h-full cursor-pointer appearance-none bg-transparent"
                  style={{
                    opacity: 0,
                    writingMode: "vertical-lr",
                    direction: "ltr",
                  }}
                />
              </div>

              {/* Vertical Opacity Bar */}
              <div className="relative w-4 aspect-[1/8] rounded overflow-visible border-2 border-border cursor-pointer">
                {/* Checkerboard pattern for transparency */}
                <svg
                  className="absolute inset-0 w-full h-full rounded"
                  viewBox="0 0 20 100"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <pattern
                      id="checkerboardVertical"
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect x="0" y="0" width="5" height="5" fill="#cccccc" />
                      <rect x="5" y="0" width="5" height="5" fill="#ffffff" />
                      <rect x="0" y="5" width="5" height="5" fill="#ffffff" />
                      <rect x="5" y="5" width="5" height="5" fill="#cccccc" />
                    </pattern>
                  </defs>
                  <rect
                    width="20"
                    height="100"
                    fill="url(#checkerboardVertical)"
                  />
                </svg>
                <svg
                  className="absolute inset-0 w-full h-full rounded"
                  viewBox="0 0 20 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="opacityGradientVertical"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={`hsla(${hue}, ${saturation}%, ${lightness}%, 0)`}
                      />
                      <stop
                        offset="100%"
                        stopColor={`hsla(${hue}, ${saturation}%, ${lightness}%, 1)`}
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    width="20"
                    height="100"
                    fill="url(#opacityGradientVertical)"
                  />
                </svg>
                {/* Square selector */}
                <div
                  className="absolute left-1/2 w-5 h-5 border-2 border-white rounded pointer-events-none shadow-lg"
                  style={{
                    top: `${opacity}%`,
                    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity / 100})`,
                    willChange: "transform, top",
                    transform: "translate(-50%, -50%)",
                    zIndex: 20,
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full cursor-pointer appearance-none bg-transparent"
                  style={{
                    opacity: 0,
                    writingMode: "vertical-lr",
                    direction: "ltr",
                  }}
                />
              </div>
            </div>

            {/* Input Fields */}
            <div className="flex gap-2 text-sm">
              {/* HEX - 2x width */}
              <div className="flex-[2] flex flex-col items-center">
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm font-mono text-center"
                  placeholder="#000000"
                />
                <label className="text-xs font-semibold text-foreground/70 mt-1">
                  HEX
                </label>
              </div>

              {/* R */}
              <div className="flex-1 flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) =>
                    updateFromRGB(Number(e.target.value), rgb.g, rgb.b)
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <label className="text-xs font-semibold text-foreground/70 mt-1">
                  R
                </label>
              </div>

              {/* G */}
              <div className="flex-1 flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) =>
                    updateFromRGB(rgb.r, Number(e.target.value), rgb.b)
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <label className="text-xs font-semibold text-foreground/70 mt-1">
                  G
                </label>
              </div>

              {/* B */}
              <div className="flex-1 flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) =>
                    updateFromRGB(rgb.r, rgb.g, Number(e.target.value))
                  }
                  className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <label className="text-xs font-semibold text-foreground/70 mt-1">
                  B
                </label>
              </div>

              {/* Opacity */}
              <div className="flex-1 flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded border border-border bg-background text-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <label className="text-xs font-semibold text-foreground/70 mt-1">
                  Opacity
                </label>
              </div>
            </div>

            {/* Color Preview */}
            <div
              className="h-12 rounded border-2 border-border"
              style={{
                backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity / 100})`,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
