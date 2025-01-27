import React, { lazy, useState, useEffect } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Routes = lazy(() => import("./routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Menu = lazy(() => import("./Views/menu"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));

// Tema claro personalizado sem azul
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8c8c8c", // Cor principal neutra
    },
    secondary: {
      main: "#b3b3b3", // Outra cor neutra
    },
    background: {
      default: "#f5f5f5", // Cor de fundo clara
      paper: "#ffffff", // Cor dos elementos de papel
    },
    text: {
      primary: "#000000", // Cor principal do texto
      secondary: "#4f4f4f", // Cor secundária do texto
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Fonte limpa e neutra
  },
});

const Home = () => {
  const [urlAtual, setUrlAtual] = useState("");

  useEffect(() => {
    setUrlAtual(window.location.href);
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container maxWidth="xl" disableGutters>
        <Menu />
        <Routes />
        <SocialShareBar className="Container" url={urlAtual} title="Confira o meu trabalho!" />
        <Back />
        <ProTip />
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(Home);
