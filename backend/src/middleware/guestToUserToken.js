const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const guestToUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If it's a guest token, extract the main userId
    if (decoded.guestId && decoded.userId) {
      req.user = { userId: decoded.userId }; // guest login scenario
    }
    // If it's a regular user token
    else if (decoded.userId) {
      req.user = { userId: decoded.userId };
    } else {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = guestToUserToken;
