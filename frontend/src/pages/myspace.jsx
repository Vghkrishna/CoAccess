import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import API from "../api";
import { showSuccess, showError, showConfirm } from "../utils/swal";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const MySpace = () => {
  const navigate = useNavigate();
  const [taskHeading, setTaskHeading] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [guestname, setGuestName] = useState("");
  const [permission, setpermission] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedBody, setEditedBody] = useState("");

  // Get userId from token or guestToken
  useEffect(() => {
    const guestToken = localStorage.getItem("guestToken");
    const mainUser = localStorage.getItem("token");
    const token = localStorage.getItem("token");
    if (guestToken) {
      const guestData = JSON.parse(localStorage.getItem("guest"));
      console.log(guestData.permissions);

      setGuestName(guestData.deviceName);
      setpermission(guestData.permissions);
    }
    if (guestToken) {
      const decoded = jwtDecode(guestToken);
      setUserId(decoded.userId);
      setAuthToken(guestToken);
    } else if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
      setAuthToken(token);
    }
  }, []);
  const handleLogout = async () => {
    await API.post("/user/logout");
    localStorage.clear();
    showSuccess("logout successfull!").then(() => {
      navigate("/login");
    });
  };
  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditedBody(
      Array.isArray(task.taskBody) ? task.taskBody.join("\n") : task.taskBody
    );
  };

  const fetchTasks = async () => {
    try {
      const guestToken = localStorage.getItem("guestToken");
      const token = guestToken || localStorage.getItem("token"); // prioritize guestToken if available
      const res = await API.get("/myspace/gettask", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks || []);
    } catch (err) {
      showError("Failed to load tasks");
    }
  };

  const handleAddTask = async () => {
    if (!taskHeading.trim()) return showError("Task heading is required");

    try {
      const res = await API.post(
        "/myspace/addtask",
        {
          taskHead: taskHeading,
          taskBody: taskBody.split("\n").filter((line) => line.trim() !== ""),
          userId, // <-- include userId from token
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setTaskHeading("");
      setTaskBody("");
      showSuccess("Task added successfully!");
      fetchTasks();
    } catch (err) {
      showError("Failed to add task");
    }
  };
  const handleUpadteTask = async (taskId, updatedTask) => {
    try {
      const res = await API.put(
        `myspace/updatetask/${taskId}`,
        { taskBody: updatedTask },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      showSuccess("Task updated successfully!");
      fetchTasks();
    } catch (err) {
      showError("Failed to update task");
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await API.put(
        `/myspace/updatestatus/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      showSuccess("Status updated successfully!");
      fetchTasks(); // refresh tasks list
    } catch (err) {
      showError("Failed to update task status");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId, authToken]);

  return (
    <>
      <Dialog
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1e1e1e",
            color: "#90caf9",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Editing: {editingTask?.taskHead}
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: "#1e1e1e" }}>
          <TextField
            label="Task Points (one per line)"
            multiline
            rows={6}
            variant="filled"
            fullWidth
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: "#1e1e1e",
              textarea: { color: "#fff" },
              label: { color: "#ccc" },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "#1e1e1e",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={() => setEditingTask(null)}
            sx={{
              textTransform: "none",
              color: "#ccc",
              borderColor: "#ccc",
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const formattedBody = editedBody
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line !== "");

              handleUpadteTask(editingTask._id, formattedBody);
              setEditingTask(null);
            }}
            sx={{
              textTransform: "none",
              backgroundColor: "#2196f3",
              ":hover": { backgroundColor: "#1976d2" },
            }}
          >
            💾 Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#121212",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          {/* Left-side placeholder for symmetry */}
          <Box width={120} />

          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#90caf9",
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            🧠 {guestname || "My"} Space
          </Typography>

          {guestname ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                background: "linear-gradient(45deg, #e53935 30%, #d32f2f 90%)",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "8px",
                px: 3,
                py: 1,
                boxShadow: "0 3px 5px 2px rgba(229, 57, 53, .3)",
                textTransform: "none",
                ":hover": {
                  background:
                    "linear-gradient(45deg, #d32f2f 30%, #b71c1c 90%)",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Box width={120} />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            flex: 1,
          }}
        >
          {/* Left Side - Form */}
          {(!guestname || permission[0] === "admin") && (
            <Box flex={1}>
              <TextField
                label="Task Heading"
                variant="filled"
                fullWidth
                value={taskHeading}
                onChange={(e) => setTaskHeading(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#1e1e1e",
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                }}
              />
              <TextField
                label="Task Points (one per line)"
                multiline
                rows={6}
                variant="filled"
                fullWidth
                value={taskBody}
                onChange={(e) => setTaskBody(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "#1e1e1e",
                  textarea: { color: "#fff" },
                  label: { color: "#ccc" },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAddTask}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#2196f3",
                  ":hover": { backgroundColor: "#1976d2" },
                }}
              >
                ➕ Add Task
              </Button>
            </Box>
          )}

          {/* Right Side - Task List */}
          <Box flex={1} sx={{ maxHeight: "75vh", overflowY: "auto", pr: 1 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "#121212",
                zIndex: 1,
                pb: 1,
              }}
            >
              📋 Today's Tasks
            </Typography>
            {tasks.length === 0 ? (
              <Typography color="text.secondary">No tasks yet!</Typography>
            ) : (
              <List>
                {[...tasks].reverse().map((task, index) => (
                  <Box
                    key={index}
                    mb={3}
                    sx={{
                      border: "1px solid #333",
                      borderRadius: 2,
                      p: 2,
                      backgroundColor: "#1e1e1e",
                      position: "relative",
                    }}
                  >
                    <Chip
                      label={task.status || "Pending"}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor:
                          task.status === "Completed"
                            ? "#4caf50"
                            : task.status === "In Progress"
                            ? "#ff9800"
                            : "#f44336",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />

                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#90caf9", fontWeight: 600, mb: 1 }}
                    >
                      📝 {task.taskHead}
                    </Typography>

                    <List dense disablePadding>
                      {Array.isArray(task.taskBody) ? (
                        task.taskBody.map((point, i) => (
                          <ListItem key={i} sx={{ pl: 2 }}>
                            <ListItemText
                              primary={`• ${point}`}
                              primaryTypographyProps={{
                                style: { color: "#ccc" },
                              }}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ pl: 2 }}>
                          <ListItemText
                            primary={`• ${task.taskBody}`}
                            primaryTypographyProps={{
                              style: { color: "#ccc" },
                            }}
                          />
                        </ListItem>
                      )}
                    </List>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end", // aligned to right
                        alignItems: "center",
                        mt: 2,
                        gap: 2,
                      }}
                    >
                      {/* Status Update */}
                      <Select
                        displayEmpty
                        variant="outlined"
                        size="small"
                        value={task.status || "Pending"}
                        onChange={async (e) => {
                          const selectedStatus = e.target.value;
                          const confirmed = await showConfirm(
                            `Are you sure you want to change status to "${selectedStatus}"?`
                          );
                          if (confirmed) {
                            handleUpdateStatus(task._id, selectedStatus);
                          }
                        }}
                        sx={{
                          backgroundColor: "#1f1f1f",
                          color: "#fff",
                          borderRadius: 2,
                          minWidth: 180,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#444",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#888",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#00bcd4",
                          },
                          "& .MuiSelect-icon": {
                            color: "#fff",
                          },
                          "& .MuiSelect-select": {
                            padding: "10px",
                          },
                        }}
                      >
                        <MenuItem value="Pending">
                          🕒 <span style={{ marginLeft: 8 }}>Pending</span>
                        </MenuItem>
                        <MenuItem value="In Progress">
                          ⚙️ <span style={{ marginLeft: 8 }}>In Progress</span>
                        </MenuItem>
                        <MenuItem value="Completed">
                          ✅ <span style={{ marginLeft: 8 }}>Completed</span>
                        </MenuItem>
                      </Select>

                      {/* 🖊️ Edit Button */}
                      {(!guestname || permission[0] === "Update") && (
                        <Button
                          variant="outlined"
                          size="medium"
                          sx={{ color: "#90caf9", borderColor: "#90caf9" }}
                          onClick={() => {
                            setEditingTask(task);
                            setEditedBody(
                              Array.isArray(task.taskBody)
                                ? task.taskBody.join("\n")
                                : task.taskBody
                            );
                          }}
                        >
                          ✏️ Edit
                        </Button>
                      )}
                    </Box>

                    <Divider sx={{ mt: 2, borderColor: "#444" }} />
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MySpace;
