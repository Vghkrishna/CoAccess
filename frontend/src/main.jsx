import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";

// Create your custom theme
const theme = createTheme({
  typography: {
    fontSize: 17, // Base font size in px
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    body1: {
      fontSize: "1.1rem",
    },
    body2: {
      fontSize: "1rem",
    },
  },
  palette: {
    mode: "dark", // or 'light' if you want to support both
  },
});

// Render the app with ThemeProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
