
import { createTheme } from "@mui/material/styles";
import '@fontsource/roboto/300.css';


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#005B9F" },
    secondary: { main: "#F57C00" },
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
    sectionMarginTop: 10,
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#005B9F" },
    secondary: { main: "#F57C00" },
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
    borderRadius: 0,
  },
  customSpacing: {
    pagePadding: "0 10px",
    sectionMarginTop: 10,
  },
});