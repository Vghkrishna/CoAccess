const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceName: { type: String, required: true },
    permissions: [{ type: String, required: true }], // Array of permissions
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", GuestSchema);
module.exports = Guest;
