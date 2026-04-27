"use client";

import * as React from "react";
import { ChevronDown, Ban, Smile, Image, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EMOJI_CATEGORIES } from "@/lib/emoji-data";

type IconType = "none" | "emoji" | "logo";

interface EmojiItem {
  emoji: string;
  file: string;
}
function emojiToCodePoint(emoji: string) {
  return [...emoji].map((c) => c.codePointAt(0)?.toString(16)).join("-");
}

interface IconPickerProps {
  value?: { type: IconType; value?: string; imagePath?: string };
  onChange?: (value: {
    type: IconType;
    value?: string;
    imagePath?: string;
  }) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [selectedType, setSelectedType] = React.useState<IconType>(
    value?.type || "none",
  );
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    value?.value,
  );
  const [selectedImagePath, setSelectedImagePath] = React.useState<
    string | undefined
  >(value?.imagePath);
  const [logoDialogOpen, setLogoDialogOpen] = React.useState(false);
  const [customEmoji, setCustomEmoji] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState(
    Object.keys(EMOJI_CATEGORIES)[0],
  );
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state when value prop changes
  React.useEffect(() => {
    if (value?.type) {
      setSelectedType(value.type);
      setSelectedValue(value.value);
      setSelectedImagePath(value.imagePath);
    }
  }, [value]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
    setLogoDialogOpen(false);
  };

  const processFile = (file: File) => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or SVG file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedType("logo");
      setSelectedValue(dataUrl);
      setLogoDialogOpen(false);
      onChange?.({ type: "logo", value: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleTypeSelect = (type: IconType) => {
    if (type === "none") {
      setSelectedType("none");
      setSelectedValue(undefined);
      setSelectedImagePath(undefined);
      onChange?.({ type: "none" });
    } else if (type === "logo") {
      setLogoDialogOpen(true);
    }
  };

  const handleEmojiSelect = (emoji: string, filePath: string) => {
    setSelectedType("emoji");
    setSelectedValue(emoji);
    setSelectedImagePath(`/emojis/${filePath}`);
    onChange?.({
      type: "emoji",
      value: emoji,
      imagePath: `/emojis/${filePath}`,
    });
  };

  const handleCustomEmojiSubmit = () => {
    if (customEmoji.trim()) {
      const code = emojiToCodePoint(customEmoji.trim());
      handleEmojiSelect(customEmoji.trim(), `emoji_u${code}.png`);
      setCustomEmoji("");
    }
  };

  const getEmojiSrc = (emoji: string) => {
    const code = emojiToCodePoint(emoji);
    return `/emojis/emoji_u${code}.png`;
  };

  const getDisplayContent = () => {
    if (selectedType === "none" || !selectedValue) {
      return (
        <>
          <Ban className="size-4 text-muted-foreground" />
          <span>None</span>
        </>
      );
    }

    if (selectedType === "emoji") {
      return (
        <>
          <img
            src={selectedImagePath || getEmojiSrc(selectedValue)}
            className="size-5"
          />
          <span>Emoji</span>
        </>
      );
    }

    if (selectedType === "logo") {
      return (
        <>
          <img src={selectedValue} className="size-5 rounded" />
          <span>Logo</span>
        </>
      );
    }
  };

  return (
    <div className={cn("inline-flex", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-2 border-border/50  bg-white dark:bg-input/30 hover:bg-transparent dark:hover:bg-transparent hover:text-current"
          >
            {getDisplayContent()}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-20 rounded-lg">
          <DropdownMenuItem onClick={() => handleTypeSelect("none")}>
            <Ban className="size-4" />
            <span>None</span>
          </DropdownMenuItem>

          {/* Emoji */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Smile className="size-4" />
              <span>Emoji</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-80 p-0 rounded-lg">
                <div className="p-3 border-b font-medium text-sm">
                  Select Emoji
                </div>

                {/* Categories */}
                <div className="flex gap-1 px-2 py-1 border-b overflow-x-auto">
                  {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-2 py-1 text-xs rounded",
                        activeCategory === cat
                          ? "bg-primary text-white"
                          : "text-muted-foreground",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid */}
                <div className="p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_CATEGORIES[activeCategory].map(
                      (item: any, i: any) => (
                        <button
                          key={i}
                          onClick={() =>
                            handleEmojiSelect(item.emoji, item.file)
                          }
                          className="size-8 flex items-center justify-center rounded hover:bg-accent"
                        >
                          <img
                            src={`/emojis/${item.file}`}
                            className="size-6"
                            alt={item.emoji}
                          />
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Custom */}
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste emoji..."
                      value={customEmoji}
                      onChange={(e) => setCustomEmoji(e.target.value)}
                    />
                    <Button onClick={handleCustomEmojiSubmit}>Add</Button>
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Logo */}
          <DropdownMenuItem onClick={() => handleTypeSelect("logo")}>
            <Image className="size-4" />
            <span>Logo</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logo Upload Dialog */}
      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-2xl">✨ Upload Your Logo</DialogTitle>
            <DialogDescription>
              Choose a PNG, JPG, or SVG file to bring your logo to life
            </DialogDescription>
          </DialogHeader>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
              dragActive
                ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-[1.02] shadow-lg"
                : "border-primary/30 hover:border-primary/60 hover:bg-primary/5",
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="relative z-10">
              <div
                className={cn(
                  "inline-flex items-center justify-center size-16 rounded-full mb-4 transition-all duration-300",
                  dragActive
                    ? "bg-primary/20 scale-110"
                    : "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-105",
                )}
              >
                <Upload
                  className={cn(
                    "transition-all duration-300",
                    dragActive
                      ? "size-8 text-primary animate-bounce"
                      : "size-8 text-primary/70 group-hover:text-primary",
                  )}
                />
              </div>
              <p className="text-base font-semibold text-foreground">
                {dragActive
                  ? "🎯 Drop your image here!"
                  : "Drag & drop your logo"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                or click to browse your files
              </p>
              <p className="text-xs text-primary/70 mt-3 font-medium">
                PNG • JPG • SVG
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLogoDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="size-4" />
              Browse Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
