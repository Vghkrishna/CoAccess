import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Slide,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, forwardRef, useEffect } from "react";
import API from "../api";
import { showError, showSuccess } from "../utils/swal";
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGuestCard = ({ setSelectedCard }) => {
  const [open, setOpen] = useState(true); // open by default
  const [deviceName, setDeviceName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [duration, setDuration] = useState(15); // default 15 min
  const navigate = useNavigate();

  const handleCancel = () => {
    setSelectedCard(null);
    //navigate("/dashboard"); // or whatever your route is
    setOpen(false);
  };
  const handleCreate = async () => {
    if (!deviceName || permissions.length === 0 || !duration) {
      showError("Please fill in all fields.");
      return;
    }

    try {
      const res = await API.post("/guest/start", {
        deviceName,
        permissions,
        duration,
      });

      const { guestToken, expiresAt } = res.data;
      showSuccess(
        `Guest created successfully!\nExpires at: ${new Date(
          expiresAt
        ).toLocaleTimeString()}`,
        setSelectedCard(null)
      );
      setOpen(false);
      // Optionally store or use guestToken
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create guest.");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Start Guest Session
          <IconButton
            aria-label="close"
            onClick={() => handleCancel()}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            paddingTop: 3,
          }}
        >
          <TextField
            label="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Permissions"
            value={permissions}
            onChange={(e) => setPermissions([e.target.value])}
            fullWidth
          >
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancel()} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateGuestCard;
