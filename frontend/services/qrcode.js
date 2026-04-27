import api from "@/lib/api";

/**
 * Create a new QR code and save its metadata.
 * POST /api/qrcode/create
 * Body: { type, size, content, color, logoType, logoValue }
 */
export const createQRCode = async (qrData) => {
  const response = await api.post("/qrcode/create", qrData);
  return response.data;
};

/**
 * Fetch all QR codes for the current user.
 * GET /api/qrcode/all
 */
export const fetchQRCodes = async () => {
  const response = await api.get("/qrcode/all");
  return response.data;
};

/**
 * Delete a QR code by ID.
 * DELETE /api/qrcode/:id
 */
export const deleteQRCode = async (id) => {
  const response = await api.delete(`/qrcode/${id}`);
  return response.data;
};

/**
 * Get a pre-signed S3 upload URL for logo images.
 * POST /api/qrcode/upload-url
 * Body: { fileName, fileType }
 */
export const getLogoUploadUrl = async (fileName, fileType) => {
  const response = await api.post("/qrcode/upload-url", {
    fileName,
    fileType,
  });
  return response.data;
};
