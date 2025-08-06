
import { createTheme } from "@mui/material/styles";
import '@fontsource/roboto/300.css';


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#F57C00" },
    secondary: { main: "#005B9F" },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: { primary: "#222" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  shape: {
    borderRadius: 5,
  },
  customSpacing: {
    pagePadding: "0 10px",
    sectionMarginTop: 15,
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F57C00" },
    secondary: { main: "#005B9F" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: { primary: "#ffffff" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  shape: {
    borderRadius: 5,
  },
  customSpacing: {
    pagePadding: "0 10px",
    sectionMarginTop: 15,
  },
});