import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import "./App.css";

const App = () => {
  return (
    <Container fixed>
      <Menu />
      <Main />
    </Container>
  );
};
export default App;
