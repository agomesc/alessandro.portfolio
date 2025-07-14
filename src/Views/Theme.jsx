
import { createTheme } from "@mui/material/styles";
import '@fontsource/roboto/300.css';


export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#c0810d" },
    secondary: { main: "#78884c" },
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
    borderRadius: 12,
  },
  customSpacing: {
    pagePadding: "0 10px",
    sectionMarginTop: 5,
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#c0810d" },
    secondary: { main: "#78884c" },
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
    borderRadius: 12,
  },
  customSpacing: {
    pagePadding: "0 10px",
    sectionMarginTop: 5,
  },
});