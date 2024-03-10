import * as React from "react";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Routes from "./routes";
import ProTip from "./Pages/ProTip";
import Footer from "./Pages/Footer";
import "./App.css";
import Main from "./Pages/Main"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl" disableGutters>
          <Menu />
          <Routes />
          <Main/>
          <ProTip />
          <Footer />
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
export default App;
