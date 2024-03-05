import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import "./App.css";

const App = () => {
  return (
    <Container maxWidth="x1" disableGutters>
      <Menu />
      <Main />
    </Container>
  );
};
export default App;
