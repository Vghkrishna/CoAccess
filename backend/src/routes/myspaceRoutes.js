const authMiddleware = require("../middleware/authMiddleware"); // adjust path as needed
const guestToUserToken = require("../middleware/guestToUserToken");
const {
  handleMyTask,
  handleGetMyTask,
  handleStatusUpdate,
  handleUpdateTask,
} = require("../controllers/mySpaceController");
const express = require("express");
const router = express.Router();
router.post("/addtask", guestToUserToken, handleMyTask);
router.get("/gettask", guestToUserToken, handleGetMyTask);
router.put("/updatestatus/:id", guestToUserToken, handleStatusUpdate);
router.put("/updatetask/:id", guestToUserToken, handleUpdateTask);

module.exports = router;
