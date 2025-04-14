const Guest = require("../models/guest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Start Guest Session
const startGuestSession = async (req, res) => {
  try {
    const { deviceName, permissions, duration } = req.body;
    const userId = req.user.userId;

    if (!deviceName || !permissions || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate expiry time and format it
    const now = new Date();
    const expiresTime = new Date(now.getTime() + duration * 60 * 1000);

    const formattedExpiresAt = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(expiresTime);
    const guest = new Guest({
      userId,
      deviceName,
      permissions,
      expiresAt: expiresTime,
    });

    await guest.save();

    const guestToken = jwt.sign(
      { guestId: guest._id, permissions },
      JWT_SECRET,
      { expiresIn: duration * 60 }
    );

    res.status(201).json({
      message: "Guest mode activated",
      guestToken,
      expiresAt: formattedExpiresAt,
      duration: `${duration} minute${duration > 1 ? "s" : ""}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Get All  Guest Sessions

const getAllGuests = async (req, res) => {
  try {
    const GuestsData = await Guest.find({
      userId: req.user.userId,
    });

    const guestTokens = GuestsData.map((guestSession) =>
      jwt.sign(
        { guestId: guestSession._id, userId: req.user.userId },
        process.env.JWT_SECRET
      )
    );

    res.status(200).json({
      GuestsData,
      guestTokens,
      message:
        GuestsData.length === 0
          ? "No guest sessions found"
          : "All guest sessions retrieved",
    });
  } catch (error) {
    console.error("Error in getAllGuests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//🔹 Get Active Guest Session
const getActiveGuestSession = async (req, res) => {
  try {
    const now = new Date();

    const activeGuests = await Guest.find({
      userId: req.user.userId,
      expiresAt: { $gt: now },
    });

    const guestTokens = activeGuests.map((guestSession) =>
      jwt.sign(
        { guestId: guestSession._id, userId: req.user.userId },
        process.env.JWT_SECRET
      )
    );

    res.status(200).json({
      activeGuests,
      guestTokens,
      message:
        activeGuests.length === 0
          ? "No active guest sessions found"
          : "Active guest sessions retrieved",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Extend Guest Session
// const extendGuestSession = async (req, res) => {
//   try {
//     const { extraTime } = req.body;
//     const guest = await Guest.findOne({
//       _id: req.params.guestId,
//       userId: req.user.userId,
//     });

//     if (!guest) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     guest.expiresAt = new Date(
//       guest.expiresAt.getTime() + extraTime * 60 * 1000
//     );
//     await guest.save();

//     res.status(200).json({
//       message: `Session extended by ${extraTime} minutes`,
//       newExpiry: guest.expiresAt,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// 🔹 End Guest Session
const endGuestSession = async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({
      _id: req.params.guestId,
      userId: req.user.userId, // FIXED HERE
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest session not found" });
    }

    res.status(200).json({ message: "Guest session ended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const loginAsGuest = async (req, res) => {
  const { guestToken } = req.body;

  if (!guestToken) {
    return res.status(400).json({ message: "Guest token is required" });
  }

  try {
    const decoded = jwt.verify(guestToken, JWT_SECRET);

    const guest = await Guest.findById(decoded.guestId);

    if (!guest || guest.expiresAt < new Date()) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    return res.status(200).json({
      message: "Guest login successful",
      guest: {
        guestId: guest._id,
        userId: guest.userId,
        deviceName: guest.deviceName,
        permissions: guest.permissions,
        expiresAt: guest.expiresAt,
      },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = {
  startGuestSession,
  getAllGuests,
  endGuestSession,
  getActiveGuestSession,
  loginAsGuest,
};
