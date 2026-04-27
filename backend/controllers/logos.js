const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const handleGetUploadUrl = async (req, res) => {
  const { fileName, fileType } = req.body;

  const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({
      error: "Invalid file type. Only JPG, PNG, and SVG are allowed.",
    });
  }

  const uniqueKey = `logos/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: "shortify-logos",
    Key: uniqueKey,
    ContentType: fileType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // Note: Replace <your-id> with your actual R2 Public Bucket ID from Cloudflare
    const publicUrl = `https://pub-38c471ee1e854994baa2474ae589a711.r2.dev/${uniqueKey}`;

    res.json({
      uploadUrl: url,
      imageUrl: publicUrl,
    });
  } catch (err) {
    console.error("R2 Sig Error:", err);
    res.status(500).json({ error: "Could not generate upload slot" });
  }
};
