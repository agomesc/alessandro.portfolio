import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Menu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Meu Site</Typography>
        <Button color="inherit" href="/">
          Início
        </Button>
        <Button color="inherit" href="/sobre">
          Sobre
        </Button>
        {/* Adicione mais botões conforme necessário */}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
