import Menu from "./Components/menu";
import Back from "./Components/Back";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Routes from "./routes";
import Footer from "./Views/Footer";

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
				<Footer />
			</Container>
		</ThemeProvider>
	);
};

export default App;
