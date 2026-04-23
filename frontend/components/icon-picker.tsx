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

type IconType = "none" | "emoji" | "logo";

interface EmojiItem {
  emoji: string;
  file: string;
}

const EMOJI_CATEGORIES: any = {
  Smileys: [
    { emoji: "😀", file: "emoji_u1f600.png" },
    { emoji: "😃", file: "emoji_u1f603.png" },
    { emoji: "😄", file: "emoji_u1f604.png" },
    { emoji: "😁", file: "emoji_u1f601.png" },
    { emoji: "😆", file: "emoji_u1f606.png" },
    { emoji: "😅", file: "emoji_u1f605.png" },
    { emoji: "🤣", file: "emoji_u1f923.png" },
    { emoji: "😂", file: "emoji_u1f602.png" },
    { emoji: "🙂", file: "emoji_u1f642.png" },
    { emoji: "🙃", file: "emoji_u1f643.png" },
    { emoji: "😉", file: "emoji_u1f609.png" },
    { emoji: "😊", file: "emoji_u1f60a.png" },
    { emoji: "😇", file: "emoji_u1f607.png" },
    { emoji: "🥰", file: "emoji_u1f970.png" },
    { emoji: "😍", file: "emoji_u1f60d.png" },
    { emoji: "🤩", file: "emoji_u1f929.png" },
    { emoji: "😘", file: "emoji_u1f618.png" },
    { emoji: "😗", file: "emoji_u1f617.png" },
    { emoji: "😚", file: "emoji_u1f61a.png" },
    { emoji: "😙", file: "emoji_u1f619.png" },
    { emoji: "😋", file: "emoji_u1f60b.png" },
    { emoji: "😛", file: "emoji_u1f61b.png" },
    { emoji: "😜", file: "emoji_u1f61c.png" },
    { emoji: "🤪", file: "emoji_u1f92a.png" },
    { emoji: "😝", file: "emoji_u1f61d.png" },
    { emoji: "🤑", file: "emoji_u1f911.png" },
    { emoji: "🤗", file: "emoji_u1f917.png" },
    { emoji: "🤭", file: "emoji_u1f92d.png" },
    { emoji: "🤫", file: "emoji_u1f92b.png" },
    { emoji: "🤔", file: "emoji_u1f914.png" },
    { emoji: "🤐", file: "emoji_u1f910.png" },
    { emoji: "🤨", file: "emoji_u1f928.png" },
    { emoji: "😐", file: "emoji_u1f610.png" },
    { emoji: "😑", file: "emoji_u1f611.png" },
    { emoji: "😶", file: "emoji_u1f636.png" },
    { emoji: "😏", file: "emoji_u1f60f.png" },
    { emoji: "😒", file: "emoji_u1f612.png" },
    { emoji: "🙄", file: "emoji_u1f644.png" },
    { emoji: "😬", file: "emoji_u1f62c.png" },
    { emoji: "🤥", file: "emoji_u1f925.png" },
    { emoji: "😌", file: "emoji_u1f60c.png" },
    { emoji: "😔", file: "emoji_u1f614.png" },
    { emoji: "😪", file: "emoji_u1f62a.png" },
    { emoji: "🤤", file: "emoji_u1f924.png" },
    { emoji: "😴", file: "emoji_u1f634.png" },
    { emoji: "😷", file: "emoji_u1f637.png" },
    { emoji: "🤒", file: "emoji_u1f912.png" },
    { emoji: "🤕", file: "emoji_u1f915.png" },
    { emoji: "🤢", file: "emoji_u1f922.png" },
    { emoji: "🤮", file: "emoji_u1f92e.png" },
    { emoji: "🥵", file: "emoji_u1f975.png" },
    { emoji: "🥶", file: "emoji_u1f976.png" },
    { emoji: "🥴", file: "emoji_u1f974.png" },
    { emoji: "😵", file: "emoji_u1f635.png" },
    { emoji: "🤯", file: "emoji_u1f92f.png" },
    { emoji: "🤠", file: "emoji_u1f920.png" },
    { emoji: "🥳", file: "emoji_u1f973.png" },
    { emoji: "😎", file: "emoji_u1f60e.png" },
    { emoji: "🤓", file: "emoji_u1f913.png" },
    { emoji: "🧐", file: "emoji_u1f9d0.png" },
  ],
};
function emojiToCodePoint(emoji: string) {
  return [...emoji].map((c) => c.codePointAt(0)?.toString(16)).join("-");
}

interface IconPickerProps {
  value?: { type: IconType; value?: string };
  onChange?: (value: { type: IconType; value?: string }) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [selectedType, setSelectedType] = React.useState<IconType>(
    value?.type || "none",
  );
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    value?.value,
  );
  const [logoDialogOpen, setLogoDialogOpen] = React.useState(false);
  const [customEmoji, setCustomEmoji] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("Smileys");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTypeSelect = (type: IconType) => {
    if (type === "none") {
      setSelectedType("none");
      setSelectedValue(undefined);
      onChange?.({ type: "none" });
    } else if (type === "logo") {
      setLogoDialogOpen(true);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedType("emoji");
    setSelectedValue(emoji);
    onChange?.({ type: "emoji", value: emoji });
  };

  const handleCustomEmojiSubmit = () => {
    if (customEmoji.trim()) {
      handleEmojiSelect(customEmoji.trim());
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
          <img src={getEmojiSrc(selectedValue)} className="size-5" />
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
          <Button variant="outline" className="gap-2">
            {getDisplayContent()}
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-20">
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
              <DropdownMenuSubContent className="w-80 p-0">
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
                          onClick={() => handleEmojiSelect(item.emoji)}
                          className="size-8 flex items-center justify-center rounded hover:bg-accent"
                        >
                          <img
                            src={`/emojis/${item.file}`}
                            className="size-6"
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
    </div>
  );
}
