import express from "express";
import mongoose from "mongoose";
import Domain from "../models/domain.js";
import User from "../models/user.js";

export const handleFetchDomains = async (req, res) => {
  try {
    const user_id = req.user.id;
    const userDomain = await Domain.getDomainList(user_id);

    const admin = await User.findUserByEmail(process.env.ADMIN_EMAIL);
    // Skip fetching admin domains separately if the current user IS the admin
    const adminDomain =
      admin && admin._id.toString() !== user_id.toString()
        ? await Domain.getDomainList(admin._id)
        : [];

    // Deduplicate by name (safety net)
    const seen = new Set();
    const merged = [...userDomain, ...adminDomain].filter((d) => {
      if (seen.has(d.name)) return false;
      seen.add(d.name);
      return true;
    });

    const result = { domainList: merged };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in fetching domain list" });
  }
};

export const handleStoreDomains = async (req, res) => {
  try {
    let { domain } = req.body;
    if (domain) domain = domain.replace(/^https?:\/\//i, '');
    const domianExists = await Domain.findOne({ name: domain });

    if (domianExists) return res.json({ message: "domain already exits" });

    Domain.create({
      name: domain,
      user_id: req.user.id,
      verify_token: "NA",
      verified: false,
    });
    const result = {
      message: "domain added sucesfully",
      domain: domain,
    };
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in storing domain list" });
  }
};

export const handleVerifyDomain = async (req, res) => {
  try {
    const domain = await Domain.findOne({
      _id: req.params.id,
      owner_id: req.user.id,
    });

    if (!domain) return res.status(404).json({ message: "Domain not found" });
    if (domain.verified)
      return res.status(400).json({ message: "Already verified" });

    //TODO check the custom domain feature and api
    const dns = require("dns").promises;
    const cname = await dns.resolveCname(domain.name);

    if (cname.some((r) => r.includes(process.env.APP_DOMAIN))) {
      domain.verified = true;
      await domain.save();
      return res.status(200).json({ message: "Domain verified" });
    }

    res.status(400).json({ message: "CNAME not found" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const handleDeleteDomains = async (req, res) => {
  try {
    const domain = await Domain.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!domain)
      return res.status(400).json({
        message:
          "domain is either not in db or domain is not linked to ue user_id",
      });
    return res.status(200).json({ message: "domain deleted sucessfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in fetching domain list" });
  }
};
