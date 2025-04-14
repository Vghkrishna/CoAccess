import React, { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { showSuccess, showError } from "../utils/swal"; // <-- Import swal

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/user/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const { token, user } = response.data;

      if (!token) {
        showError("Login failed. No token received.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSuccess("Login successful!").then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      showError(message);
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
            Login as a User
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                style: { color: "#fff", borderColor: "#555" },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                style: { color: "#fff", borderColor: "#555" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              size="large"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/guest-login")}
              size="large"
              sx={{
                mt: 2,
                borderColor: "#64b5f6",
                color: "#64b5f6",
                "&:hover": {
                  backgroundColor: "#64b5f6",
                  color: "#000",
                },
              }}
            >
              Login as Guest
            </Button>
          </Box>
          <Typography align="center" variant="body2" mt={3}>
            Don’t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
              underline="hover"
              sx={{ color: "#64b5f6" }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
