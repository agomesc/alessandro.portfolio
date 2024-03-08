import * as React from "react";
import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";

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
        <Container maxWidth="lg" style={{ height: "100vh", width: "100%" }}>
          <Menu />
          <Main />
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
export default App;
