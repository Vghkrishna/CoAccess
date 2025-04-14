const MySchema = require("../models/myspace");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const handleMyTask = async (req, res) => {
  try {
    const { taskHead, taskBody } = req.body;

    const newTask = new MySchema({
      taskHead,
      taskBody,
      userId: req.user.userId,
      status: "pending",
    });

    await newTask.save();

    res.status(201).json({ message: "Task saved successfully", task: newTask });
  } catch (error) {
    console.error("Error saving task:", error);
    res
      .status(500)
      .json({ message: "Failed to save task", error: error.message });
  }
};

const handleGetMyTask = async (req, res) => {
  try {
    const userId = req.user.userId; // This comes from your JWT
    console.log(userId);

    const tasks = await MySchema.find({ userId });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

const handleStatusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await MySchema.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};
const handleUpdateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskBody } = req.body;
    const updatedTask = await MySchema.findByIdAndUpdate(
      id,
      { taskBody },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    // changed from 'errr' to 'error'
    console.error("Error updating Task:", error);
    res.status(500).json({
      message: "Failed to update Task",
      error: error.message,
    });
  }
};

module.exports = {
  handleMyTask,
  handleGetMyTask,
  handleStatusUpdate,
  handleUpdateTask,
};
