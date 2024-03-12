import Menu from "./Components/menu";
import Back from "./Components/Back";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Routes from "./routes";
import ProTip from "./Pages/ProTip";
import Footer from "./Pages/Footer";
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" disableGutters>
        <Menu />
        <Routes />
        <Back />
        <ProTip />
        <Footer />
      </Container>
    </ThemeProvider>
  );
};
export default App;
