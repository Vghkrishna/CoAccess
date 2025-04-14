const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied. No Token Provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
