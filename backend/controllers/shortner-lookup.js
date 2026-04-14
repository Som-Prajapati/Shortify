import ShortnerLookup from "../models/shortner-lookup.js";
import Shortner from "../models/shortner.js";

export const handleRedirect = async (req, res) => {
  try {
    const { shortId } = req.params;
    // Use req.headers.host so "localhost:3001" matches what's stored in the DB
    const domain = req.headers.host;

    // Fast lookup via the lookup collection
    const entry = await ShortnerLookup.findOne({ domain, shortid: shortId });

    if (!entry) {
      return res.status(404).send("Short URL not found.");
    }

    // Increment click counter
    await Shortner.updateOne({ domain, shortId }, { $inc: { clicks: 1 } });

    return res.redirect(302, entry.original_url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error during redirect.");
  }
};
