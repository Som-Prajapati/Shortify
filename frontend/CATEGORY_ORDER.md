# Emoji Category Order Configuration

## Current Order

The emoji categories appear in the following order:

1. **Smileys** (111 emojis) - Always first
2. **Hearts** (25 emojis) - Always second
3. **alphabets** (26 emojis) - Alphabetically sorted
4. **Animals** (124 emojis) - Alphabetically sorted
5. **Flowers** (24 emojis) - Alphabetically sorted
6. **Food** (107 emojis) - Alphabetically sorted
7. **Horoscope** (56 emojis) - Alphabetically sorted

## How It Works

The category order is maintained in the emoji data generator script:
- **Location:** `scripts/generate-emoji-data.js`
- **Logic:** Categories are sorted with Smileys first, Hearts second, and all others alphabetically

```javascript
categories.sort((a, b) => {
  if (a === "Smileys") return -1;
  if (b === "Smileys") return 1;
  if (a === "Hearts") return -1;
  if (b === "Hearts") return 1;
  return a.localeCompare(b);
});
```

## Changing the Order

To modify the category order:

1. Edit `scripts/generate-emoji-data.js`
2. Update the sorting logic in the `generateEmojiData()` function
3. Run the generator: `node scripts/generate-emoji-data.js`
4. The `lib/emoji-data.ts` file will be regenerated with the new order

### Example: Adding a Third Priority Category

```javascript
categories.sort((a, b) => {
  if (a === "Smileys") return -1;
  if (b === "Smileys") return 1;
  if (a === "Hearts") return -1;
  if (b === "Hearts") return 1;
  if (a === "Food") return -1;    // Add Food as third
  if (b === "Food") return 1;
  return a.localeCompare(b);
});
```

## Automatic Application

The IconPicker component automatically uses the category order from `EMOJI_CATEGORIES`:
- Category tabs appear in the order defined in the data file
- The first category (Smileys) is selected by default
- No changes needed in the component when order changes

## Notes

- The order is set during data generation, not at runtime
- After changing the order logic, always regenerate the data file
- The component reads categories in the order they appear in the object
- JavaScript object key order is preserved (ES2015+)

## Last Generated

Check the timestamp at the top of `lib/emoji-data.ts` to see when the data was last generated.