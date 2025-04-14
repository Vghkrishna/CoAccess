import { useState } from "react";
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
import API from "../api";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/swal"; // <-- SweetAlert import

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showError("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/user/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      const { token, user } = response.data;

      if (!token) {
        showError("Registration failed. No token received.");
        return;
      }

      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      showSuccess("Registration successful!").then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
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
            Register for Guest Mode
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "#666",
                  backgroundColor: "#2a2a2a",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
                },
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "#666",
                  backgroundColor: "#2a2a2a",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
                },
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "#666",
                  backgroundColor: "#2a2a2a",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#64b5f6" },
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                height: 48,
                fontWeight: "bold",
                letterSpacing: 1,
                backgroundColor: "#64b5f6",
                "&:hover": {
                  backgroundColor: "#42a5f5",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>
          <Typography align="center" variant="body2" mt={3}>
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              underline="hover"
              sx={{ color: "#64b5f6" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
