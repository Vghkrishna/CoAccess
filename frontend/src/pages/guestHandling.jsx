import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HistoryIcon from "@mui/icons-material/History";
import BoltIcon from "@mui/icons-material/Bolt";
import { motion } from "framer-motion";

import CreateGuestCard from "../components/CreateGuestCard";
import ActiveGuest from "../components/activeGuest";
import GuestHistory from "../components/GuestHistory";

const GuestHandling = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const dashboardCards = [
    {
      title: "Create Guest",
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      color: "#64b5f6",
    },
    {
      title: "Guest History",
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      color: "#81c784",
    },
    {
      title: "Activate Guest",
      icon: <BoltIcon sx={{ fontSize: 40 }} />,
      color: "#ffb74d",
    },
  ];

  const renderCardComponent = () => {
    switch (selectedCard) {
      case "Create Guest":
        return <CreateGuestCard setSelectedCard={setSelectedCard} />;
      case "Guest History":
        return <GuestHistory setSelectedCard={setSelectedCard} />;
      case "Activate Guest":
        return <ActiveGuest setSelectedCard={setSelectedCard} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {selectedCard ? (
        <Box>{renderCardComponent()}</Box>
      ) : (
        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    p: 3,
                    backgroundColor: card.color,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => setSelectedCard(card.title)}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    {card.icon}
                    <Typography variant="h6">{card.title}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default GuestHandling;
