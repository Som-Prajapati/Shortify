import express from "express";
import mongoose from "mongoose";

export const handleFetchDomains = async (req, res) => {
  try {
    const user_id = req.user.id;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error in fetching domain list User" });
  }
};
