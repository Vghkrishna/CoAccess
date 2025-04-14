const http = require("http");
const app = require("./app");
const connectDB = require("./src/config/db");
require("dotenv").config();

// Ensure environment variables are loaded
const PORT = process.env.PORT || 5000;

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB(); // Wait until DB is connected
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });

    // Handle unexpected errors
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      process.exit(1);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
