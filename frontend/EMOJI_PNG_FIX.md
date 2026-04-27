# Emoji PNG Fix - Using Noto Emojis in QR Codes

## Problem
When selecting an emoji for QR codes, Windows emojis were displayed instead of the Google Noto emoji PNGs you uploaded.

## Root Cause
The system was storing only the emoji **character** (😀) instead of the **image file path**. When the QR code was generated, the browser rendered the character using the Windows system font instead of your Noto PNG images.

## Solution
Updated the emoji selection flow to pass the **image file path** along with the emoji character.

## What Changed

### 1. IconPicker Component (`components/icon-picker.tsx`)
- Added `imagePath` to the interface
- Modified `handleEmojiSelect` to pass the file path: `/emojis/${filePath}`
- Now returns: `{ type: "emoji", value: "😀", imagePath: "/emojis/Smileys/emoji_u1f600.png" }`

### 2. QR Generator Tab (`components/qr-generator-tab.tsx`)
- Added `logoImagePath` state to store the PNG path
- Passes `logoImagePath` to the QR generation function
- Updates both `logoValue` and `logoImagePath` when emoji is selected

### 3. QR Generator Library (`lib/qr-generator.ts`)
- Added `logoImagePath` parameter
- Uses the provided image path directly: `img.src = logoImagePath`
- Falls back to code point conversion if no path provided (backward compatibility)

## How It Works Now

```
User selects 😀 
  → IconPicker returns: { emoji: "😀", imagePath: "/emojis/Smileys/emoji_u1f600.png" }
  → QR Generator uses: img.src = "/emojis/Smileys/emoji_u1f600.png"
  → Result: Noto emoji PNG displayed in QR code ✅
```

## Benefits
✅ QR codes now use your Google Noto emoji PNGs  
✅ Consistent emoji appearance across all platforms  
✅ High-quality emoji images in generated QR codes  
✅ No more Windows emoji font rendering  

## Testing
1. Open QR Generator
2. Select any emoji from the picker
3. Generate QR code
4. The emoji in the center will be your Noto PNG image

## Technical Details
- Emoji PNGs loaded from: `/public/emojis/{Category}/emoji_u{codepoint}.png`
- Image path passed through component chain
- Canvas API draws the actual PNG image
- Fallback to system emoji only if PNG fails to load