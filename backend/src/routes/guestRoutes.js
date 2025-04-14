const express = require("express");
const {
  startGuestSession,
  getGuestSession,
  extendGuestSession,
  endGuestSession,
  getAllGuests,
  getActiveGuestSession,
  loginAsGuest,
} = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes with authentication middleware
router.post("/start", authMiddleware, startGuestSession);
// router.get("/:guestId", authMiddleware, getGuestSession);
router.get("/guestdata", authMiddleware, getAllGuests);
//router.put("/extend/:guestId", authMiddleware, extendGuestSession);
router.delete("/end/:guestId", authMiddleware, endGuestSession);
router.get("/active/guestData", authMiddleware, getActiveGuestSession);
router.post("/guestlogin", loginAsGuest);
module.exports = router;
