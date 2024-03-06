import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // 'light' para tema claro, 'dark' para tema escuro
    primary: {
      main: "#000000", // Cor escura
    },
    secondary: {
      main: "#FFFFFF", // Cor clara
    },
  },
});

const Menu = () => {
  return (
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="subtitle">Alessandro Gomes - Portfólio</Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
  );
};

export default Menu;
