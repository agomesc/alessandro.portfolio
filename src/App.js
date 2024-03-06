import * as React from "react";
import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Menu />
        <Main />
      </Container>
    </React.Fragment>
  );
};
export default App;
