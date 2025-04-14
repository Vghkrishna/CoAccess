const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./src/routes/userRoutes");
const guestRoutes = require("./src/routes/guestRoutes");
const mySpaceRoutes = require("./src/routes/myspaceRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("dev"));

app.use("/user", userRoutes);
app.use("/guest", guestRoutes);
app.use("/myspace", mySpaceRoutes);

module.exports = app;
