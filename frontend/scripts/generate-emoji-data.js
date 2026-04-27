const fs = require("fs");
const path = require("path");

// Helper function to convert code point string to emoji
function codePointToEmoji(codeString) {
  // Remove "emoji_u" prefix and ".png" suffix
  const cleanCode = codeString.replace("emoji_u", "").replace(".png", "");

  // Split by underscore or hyphen (some emojis have multiple code points)
  const codes = cleanCode
    .split(/[_-]/)
    .filter((code) => code !== "200d" && code.length > 0);

  // Handle special cases with ZWJ (Zero Width Joiner - 200d)
  if (cleanCode.includes("200d")) {
    const parts = cleanCode.split("_");
    const codePoints = parts.map((code) => parseInt(code, 16));
    return String.fromCodePoint(...codePoints);
  }

  // Convert hex code points to characters
  const codePoints = codes.map((code) => parseInt(code, 16));
  return String.fromCodePoint(...codePoints);
}

// Main function to generate emoji data
function generateEmojiData() {
  const emojisDir = path.join(__dirname, "../public/emojis");
  let categories = fs
    .readdirSync(emojisDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Sort categories: Smileys first, Hearts second, others alphabetically
  categories.sort((a, b) => {
    if (a === "Smileys") return -1;
    if (b === "Smileys") return 1;
    if (a === "Hearts") return -1;
    if (b === "Hearts") return 1;
    return a.localeCompare(b);
  });

  const emojiData = {};

  categories.forEach((category) => {
    const categoryPath = path.join(emojisDir, category);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".png"))
      .sort();

    emojiData[category] = files
      .map((file) => {
        try {
          const emoji = codePointToEmoji(file);
          return {
            emoji: emoji,
            file: `${category}/${file}`,
          };
        } catch (error) {
          console.warn(`Warning: Could not convert ${file} to emoji`);
          return null;
        }
      })
      .filter((item) => item !== null);

    console.log(`✓ ${category}: ${emojiData[category].length} emojis`);
  });

  return emojiData;
}

// Generate and output the data
const emojiCategories = generateEmojiData();

console.log("\n📦 Generating TypeScript/JavaScript object...\n");

// Output as TypeScript/JavaScript code
const output = `// Auto-generated emoji categories data
// Generated on: ${new Date().toISOString()}

export interface EmojiItem {
  emoji: string;
  file: string;
}

export interface EmojiCategories {
  [key: string]: EmojiItem[];
}

export const EMOJI_CATEGORIES: EmojiCategories = ${JSON.stringify(emojiCategories, null, 2).replace(/"([^"]+)":/g, "$1:")};
`;

// Save to file
const outputPath = path.join(__dirname, "../lib/emoji-data.ts");
fs.writeFileSync(outputPath, output, "utf8");

console.log(`✅ Emoji data generated successfully!`);
console.log(`📁 Saved to: lib/emoji-data.ts`);
console.log(`\n📊 Summary:`);
Object.entries(emojiCategories).forEach(([category, emojis]) => {
  console.log(`   ${category}: ${emojis.length} emojis`);
});
console.log(
  `\n🎉 Total: ${Object.values(emojiCategories).reduce((sum, arr) => sum + arr.length, 0)} emojis across ${Object.keys(emojiCategories).length} categories`,
);
