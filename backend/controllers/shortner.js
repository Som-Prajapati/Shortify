import express from "express";
import mongoose from "mongoose";
import Shortner from "../models/shortner.js";
import domain from "../models/domain.js";

export const handleCreateShortner = async (req, res) => {
  try {
    const { domain, shortId, originalUrl } = req.body;
    const shortnerExists = await Shortner.findOne({ domain, shortId });
    if (shortnerExists)
      return res.status(200).json({ message: "Not available" });

    await Shortner.create({
      user_id: req.user.id,
      domain: domain,
      shortId: shortId,
      original_url: originalUrl,
    });
    return res.status(200).json({ message: "Shortner created Sucesdfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in fetching domain list" });
  }
};

export const handleCheckAvailability = async (req, res) => {
  try {
    const { domain, shortId } = req.query;

    // From query params
    console.log(domain, shortId);
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

export const handleGetAnalytics = async (req, res) => {
  try {
    const shortner_id = req.params.id;

    const shortner = await Shortner.findById({ _id: shortner_id });
    if (!shortner)
      return res.status(400).json({ message: "Shortner doesnt exits" });
    const result = {
      id: shortner_id,
      domain: shortener.domain,
      shortId: shortener.shortId,
      clicks: shortener.clicks,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
  }
};
export const handleToggleIsActive = async (req, res) => {
  try {
    const { isActive } = req.body;
    const shortner_id = req.params.id;
    const shortner = await Shortner.findById({ _id: shortner_id });
    if (!shortner)
      return res.status(400).json({ message: "Shortner doesnt exits" });
    shortner.is_active = isActive;
    await shortner.save();
    return res.status(400).json({ message: `Sucessfully ${isActive}` });
    //TODO error if false remove from lookup
    const shortener = await Shortner.findById({ _id: shortner_id });
    console.log(shortner_id);
    if (!shortener)
      return res.status(400).json({ message: "Shortner doesnt exits" });
    const result = {
      id: shortner_id,
      domain: shortener.domain,
      shortId: shortener.shortId,
      clicks: shortener.clicks,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
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
    if (!shortner) res.status(400).json({ message: "Shortner not available" });
    await Shortner.deleteOne({ _id: shortner_id });
    res.status(400).json({ message: "Deleted Sucessfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
  }
};
