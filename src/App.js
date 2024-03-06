import * as React from "react";
import Main from "./Components/main";
import Menu from "./Components/menu";
import Footer from "./Components/Footer";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" style={{ height:'100vh', width:"100%" }}>
        <Menu />
        <Main />
        <Footer />
      </Container>
    </React.Fragment>
  );
};
export default App;
