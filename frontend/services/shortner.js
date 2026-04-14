import api from "@/lib/api";

/**
 * Create a new short URL.
 * POST /api/shortner/
 * Body: { domain, shortId, originalUrl }
 */
export const createShortUrl = async (domain, shortId, originalUrl) => {
  const response = await api.post("/shortner/", { domain, shortId, originalUrl });
  return response.data;
};

/**
 * Check whether a shortId is available for a given domain.
 * GET /api/shortner/availability?domain=&shortId=
 */
export const checkAvailability = async (domain, shortId) => {
  const response = await api.get("/shortner/availability", {
    params: { domain, shortId },
  });
  return response.data; // { available: boolean }
};

/**
 * Fetch all domains (user's + admin shared).
 * GET /api/domain/
 */
export const fetchDomains = async () => {
  const response = await api.get("/domain/");
  return response.data; // { domainList: [...] }
};

/**
 * Fetch all shorteners for the current user.
 * GET /api/shortner/
 */
export const fetchShortenersList = async () => {
  const response = await api.get("/shortner/");
  return response.data; // array of shorteners
};

/**
 * Toggle the is_active status of a shortener.
 * PATCH /api/shortner/:id
 */
export const toggleShortenerActive = async (id, isActive) => {
  const response = await api.patch(`/shortner/${id}`, { isActive });
  return response.data;
};

/**
 * Delete a shortener by ID.
 * DELETE /api/shortner/:id
 */
export const deleteShortener = async (id) => {
  const response = await api.delete(`/shortner/${id}`);
  return response.data;
};
