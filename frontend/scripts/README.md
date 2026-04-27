# Scripts Documentation

This directory contains utility scripts for the Shortify project.

## generate-emoji-data.js

This script automatically scans the `public/emojis/` directory and generates a TypeScript file containing all emoji categories and their corresponding files.

### Purpose

- Automatically maps emoji files from `public/emojis/` folders to usable data structures
- Converts emoji file names (Unicode code points) to actual emoji characters
- Generates a TypeScript file with proper typing for the IconPicker component
- Supports multiple categories (Smileys, Food, Animals, Hearts, Flowers, Horoscope, alphabets, etc.)

### Usage

Run the script from the frontend directory:

```bash
node scripts/generate-emoji-data.js
```

Or from the project root:

```bash
cd frontend && node scripts/generate-emoji-data.js
```

### Output

The script generates `lib/emoji-data.ts` with the following structure:

```typescript
export const EMOJI_CATEGORIES = {
  Smileys: [
    { emoji: "😀", file: "Smileys/emoji_u1f600.png" },
    { emoji: "😃", file: "Smileys/emoji_u1f603.png" },
    // ... more emojis
  ],
  Food: [
    { emoji: "🍔", file: "Food/emoji_u1f354.png" },
    // ... more emojis
  ],
  // ... more categories
} as const;
```

### When to Run

Run this script whenever you:
- Add new emoji PNG files to any category folder in `public/emojis/`
- Create a new category folder in `public/emojis/`
- Remove or reorganize emoji files

### Adding New Emoji Categories

1. Create a new folder in `public/emojis/` (e.g., `public/emojis/Sports`)
2. Add emoji PNG files following the naming convention: `emoji_u{unicode_codepoint}.png`
   - Example: `emoji_u1f3c0.png` for 🏀 (basketball)
   - For multi-codepoint emojis (with ZWJ), use underscores: `emoji_u1f468_200d_1f373.png`
3. Run the generation script: `node scripts/generate-emoji-data.js`
4. The new category will automatically appear in the IconPicker component

### File Naming Convention

Emoji files must follow this naming pattern:
- Single emoji: `emoji_u{hex_codepoint}.png`
  - Example: `emoji_u1f600.png` (😀)
- Emoji with ZWJ (Zero Width Joiner): `emoji_u{code1}_200d_{code2}.png`
  - Example: `emoji_u1f468_200d_1f373.png` (👨‍🍳 man cook)
- Multi-codepoint emoji: `emoji_u{code1}_{code2}_{code3}.png`

### Technical Details

The script:
1. Scans all subdirectories in `public/emojis/`
2. Reads all `.png` files in each category
3. Converts Unicode code point filenames to actual emoji characters
4. Generates a TypeScript constant with proper structure
5. Saves the output to `lib/emoji-data.ts`

### Dependencies

- Node.js (built-in `fs` and `path` modules)
- No external packages required

### Troubleshooting

**Problem**: Emojis not showing up in the picker
- **Solution**: Make sure you ran the script after adding new files
- **Solution**: Check that file names follow the correct naming convention

**Problem**: Warning "Could not convert {file} to emoji"
- **Solution**: Verify the filename uses valid Unicode code points in hexadecimal format
- **Solution**: Ensure the format is `emoji_u{codepoint}.png`

**Problem**: Category not appearing
- **Solution**: Make sure the folder is directly inside `public/emojis/`
- **Solution**: Re-run the generation script
- **Solution**: Check that the folder contains at least one valid `.png` file