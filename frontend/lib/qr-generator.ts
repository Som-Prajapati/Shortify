import QRCode from "qrcode";

export function emojiToCodePoint(emoji: string) {
  // handles multi-byte emojis safely
  return [...emoji].map((char) => char.codePointAt(0)?.toString(16)).join("-");
}

export const generateQRImage = async ({
  text,
  qrSize,
  qrColor,
  logoType,
  logoValue,
  logoImagePath,
}: {
  text: string;
  qrSize: number | string;
  qrColor: string;
  logoType: string;
  logoValue: string;
  logoImagePath?: string;
}) => {
  const size = Number(qrSize);

  if (logoType === "emoji" && logoValue) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    await QRCode.toCanvas(canvas, text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: qrColor,
        light: "#ffffff",
      },
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const emojiSize = size * 0.18; // slightly better visibility
    const x = size / 2;
    const y = size / 2;
    const padding = emojiSize * 0.4;

    // 🟢 Optional shadow (premium look)
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    // ⚪ White circular background
    // ctx.fillStyle = "#ffffff";
    // ctx.beginPath();
    // ctx.arc(x, y, (emojiSize + padding) / 2, 0, Math.PI * 2);
    // ctx.fill();

    // 🔘 3D Effect / Neumorphic Style Circle
    const radius = (emojiSize + padding) / 2;

    // Create a subtle gradient for a 3D "pill" or "button" feel
    const gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius);
    gradient.addColorStop(0, "#ffffff"); // Bright center
    gradient.addColorStop(1, "#DBDBDB"); // Soft grey edge for 3D depth

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 🎨 Optional: Add a very thin light-grey stroke to define the boundary
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // ❗ Reset shadow so emoji is crisp
    ctx.shadowColor = "transparent";

    // ❗ Reset shadow so emoji is crisp
    ctx.shadowColor = "transparent";

    try {
      const img = new Image();

      // Use provided image path or fallback to code point conversion
      if (logoImagePath) {
        img.src = logoImagePath;
      } else {
        const code = emojiToCodePoint(logoValue);
        img.src = `/emojis/emoji_u${code}.png`;
      }

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // 🖼 Draw emoji image (Google Noto emoji)
      ctx.drawImage(
        img,
        x - emojiSize / 2,
        y - emojiSize / 2,
        emojiSize,
        emojiSize,
      );
    } catch (err) {
      // 🔁 Fallback to system emoji if image fails
      ctx.font = `${emojiSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(logoValue, x, y);
    }

    return canvas.toDataURL("image/png");
  }

  // 🔹 Default QR (no emoji)
  return await QRCode.toDataURL(text, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: qrColor,
      light: "#ffffff",
    },
  });
};
