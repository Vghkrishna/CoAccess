const mongoose = require("mongoose");

const mySchema = new mongoose.Schema({
  taskHead: {
    type: String,
    required: true,
  },
  taskBody: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"], // optional: restrict values
    default: "pending",
  },
});

const MySchema = mongoose.model("tasks", mySchema);
module.exports = MySchema;
