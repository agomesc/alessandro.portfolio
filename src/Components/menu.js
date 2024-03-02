import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";

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
    <Container maxWidth="ln">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Portfólio</Typography>
            <Button color="inherit" href="">
              Início
            </Button>
            <Button color="inherit" href="">
              Sobre
            </Button>
            {/* Adicione mais botões conforme necessário */}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Container>
  );
};

export default Menu;
