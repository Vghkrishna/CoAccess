import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { showSuccess } from "../utils/swal";
import LogoutIcon from "@mui/icons-material/Logout";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/guesthandling");
  };
  const handleLogout = async () => {
    await API.post("/user/logout");
    localStorage.clear();
    showSuccess("logout successfull!").then(() => {
      navigate("/login");
    });
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: "#fff", fontWeight: 600 }}
        >
          Welcome to Dashboard
        </Typography>

        <Grid container spacing={3} justifyContent="center" mt={2}>
          <Grid item xs={12} sm={10}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card
                sx={{
                  backgroundColor: "#64b5f6",
                  color: "#fff",
                  p: 3,
                  marginBottom: 4,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 6,
                  "&:hover": {
                    boxShadow: 10,
                    opacity: 0.95,
                  },
                }}
                onClick={() => navigate("/guesthandling")}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <GroupIcon sx={{ fontSize: 50 }} />
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      Handle Guests
                    </Typography>
                    <Typography variant="body2" color="inherit">
                      Create, view, and manage guest access.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card
                sx={{
                  backgroundColor: "#64b5f6",
                  color: "#fff",
                  p: 3,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: 6,
                  "&:hover": {
                    boxShadow: 10,
                    opacity: 0.95,
                  },
                }}
                onClick={() => navigate("/myspace")}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <GroupIcon sx={{ fontSize: 50 }} />
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      MySpace
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  background:
                    "linear-gradient(45deg, #e53935 30%, #d32f2f 90%)",
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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
