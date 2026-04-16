import express from "express";
import mongoose from "mongoose";
import Shortner from "../models/shortner.js";
import domain from "../models/domain.js";
import ShortnerLookup from "../models/shortner-lookup.js";

export const handleCreateShortner = async (req, res) => {
  try {
    let { domain, shortId, originalUrl } = req.body;
    if (domain) domain = domain.replace(/^https?:\/\//i, '');
    const shortnerExists = await Shortner.findOne({ domain, shortId });
    if (shortnerExists)
      return res
        .status(409)
        .json({ message: "Short ID already taken for this domain" });

    await Shortner.create({
      user_id: req.user.id,
      domain: domain,
      shortId: shortId,
      original_url: originalUrl,
    });

    // Populate the lookup collection used by the redirect handler
    await ShortnerLookup.create({
      domain: domain,
      shortid: shortId,
      original_url: originalUrl,
    });

    return res.status(201).json({ message: "Short URL created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal server error in creating short URL",
    });
  }
};

export const handleCheckAvailability = async (req, res) => {
  try {
    let { domain, shortId } = req.query;
    if (domain) domain = domain.replace(/^https?:\/\//i, '');

    // From query params
    if (!domain || !shortId) {
      return res.status(400).json({ message: "Domain and shortid required" });
    }

    const exists = await Shortner.findOne({ domain, shortId });

    if (exists) {
      return res.status(200).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
  }
};

export const handleGetAllShortners = async (req, res) => {
  try {
    const user_id = req.user.id;
    const shortners = await Shortner.find({ user_id }).sort({ created_at: -1 });

    const result = shortners.map((s) => ({
      id: s._id,
      fullShortLink: `${s.domain}/${s.shortId}`,
      originalUrl: s.original_url,
      clicks: s.clicks,
      isActive: s.is_active,
      createdAt: s.created_at,
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shortener list" });
  }
};
export const handleToggleIsActive = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user_id = req.user.id;
    const shortner_id = req.params.id;
    // Use findOne to ensure the user owns this shortener
    const shortner = await Shortner.findOne({
      _id: shortner_id,
      user_id: user_id,
    });
    if (!shortner)
      return res.status(404).json({ message: "Shortner doesnt exist" });
    shortner.is_active = isActive;
    await shortner.save();

    if (isActive) {
      // Re-add to lookup collection so redirects work again
      // We use upsert/find first to avoid duplicate key errors just in case
      await ShortnerLookup.updateOne(
        { domain: shortner.domain, shortid: shortner.shortId },
        {
          $set: {
            domain: shortner.domain,
            shortid: shortner.shortId,
            original_url: shortner.original_url,
          },
        },
        { upsert: true },
      );
    } else {
      // Remove from lookup collection so it stops redirecting instantly
      await ShortnerLookup.deleteOne({
        domain: shortner.domain,
        shortid: shortner.shortId,
      });
    }

    return res
      .status(200)
      .json({ message: `Successfully toggled to ${isActive}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error toggling shortener" });
  }
};

export const handleDeleteShortner = async (req, res) => {
  try {
    const user_id = req.user.id;
    const shortner_id = req.params.id;
    const shortner = await Shortner.findOne({
      _id: shortner_id,
      user_id: user_id,
    });
    if (!shortner)
      return res.status(404).json({ message: "Shortner not found" });

    // Remember to delete from ShortnerLookup as well, otherwise redirects still work!
    await ShortnerLookup.deleteOne({
      domain: shortner.domain,
      shortid: shortner.shortId,
    });
    await Shortner.deleteOne({ _id: shortner_id });

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting shortener" });
  }
};
