import React, { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { showSuccess, showError } from "../utils/swal";

const GuestLoginPage = () => {
  const [guestToken, setGuestToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    if (!guestToken.trim()) {
      showError("Please enter your guest token.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("guest/guestlogin", {
        guestToken: guestToken.trim(),
      });

      const { guest } = response.data;

      localStorage.setItem("guestToken", guestToken);
      localStorage.setItem("guest", JSON.stringify(guest));

      showSuccess("Logged in as Guest").then(() => {
        navigate("/myspace");
      });
    } catch (error) {
      console.error("Guest login error:", error);
      showError(error.response?.data?.message || "Invalid guest token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242424",
      }}
    >
      <Container maxWidth="sm">
        <Box
          component={Paper}
          elevation={6}
          p={8}
          borderRadius={3}
          sx={{
            background: "#1f1f1f",
            color: "#fff",
            width: "100%",
          }}
        >
          <Typography variant="h3" align="center" gutterBottom>
            Guest Login
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Guest Token"
              type="text"
              value={guestToken}
              onChange={(e) => setGuestToken(e.target.value)}
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                style: { color: "#fff", borderColor: "#555" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGuestLogin}
              size="large"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login as Guest"
              )}
            </Button>
          </Box>

          <Typography align="center" variant="body2" mt={3}>
            Are you a user?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              underline="hover"
              sx={{ color: "#64b5f6" }}
            >
              Login as User
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GuestLoginPage;
