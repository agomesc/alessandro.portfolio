import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";

const App = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Menu />
      <Main />
    </Container>
  );
};
export default App;
