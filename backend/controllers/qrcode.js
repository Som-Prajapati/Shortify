import express from "express";
import mongoose from "mongoose";
import Qrcode from "../models/qrcodes.js";

export const handleCreateQrcode = async (req, res) => {
  try {
    const { type, size, content } = req.body;
    const user_id = req.user.id;

    const qrcodeExists = await Qrcode.findOne({ user_id, type, size, content });
    if (qrcodeExists)
      return res.status(200).json({ message: "Qrcode already exists" });

    const qrcode = await Qrcode.create({
      user_id,
      type,
      size,
      content,
    });
    return res.status(201).json({ message: "Qrcode created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating qrcode" });
  }
};

export const handleDeleteQrcode = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const qrcode = await Qrcode.findOneAndDelete({ _id: id, user_id });
    if (!qrcode) return res.status(404).json({ message: "Qrcode not found" });
    return res.status(200).json({ message: "Qrcode deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting qrcode" });
  }
};

export const handleGetAllQrcodes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const qrcodes = await Qrcode.find({ user_id }).sort({ created_at: -1 });
    const formattedQrcodes = qrcodes.map((qrcode) => ({
      id: qrcode._id,
      type: qrcode.type,
      size: qrcode.size,
      content: qrcode.content,
      createdAt: qrcode.created_at,
    }));
    return res.status(200).json(formattedQrcodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching qrcodes" });
  }
};
