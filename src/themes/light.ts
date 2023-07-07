"use client";

import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#F7F7FB", // Blue 50
      main: "#4c96d7", // Blue500
    },
    secondary: {
      main: "#8484F8", // Blue300
    },
    error: {
      main: "#DB302A", // Red300
    },
    warning: {
      main: "#FF886B", // Red100
    },
    success: {
      main: "#79D969", // Green200
    },
    background: {
      default: "#F7F7FB", // Blue50
      paper: "#FFFFFF", // White
    },
    text: {
      primary: "#000000", // Black
      secondary: "#717D8A", // Grey500
    },
    grey: {
      100: "#F1F1F1", // Grey100
      300: "#D6DADE", // Grey300
      400: "#A8B0B9", // Grey400
      600: "#4F5B67", // Grey600
    },
  },
});
