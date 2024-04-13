import React, { Suspense, lazy } from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";

// Lazy load dos componentes
const Menu = lazy(() => import("./Components/menu"));
const Routes = lazy(() => import("./routes"));
const Back = lazy(() => import("./Components/Back"));
const Footer = lazy(() => import("./Views/Footer"));

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const LoadingMessage = () => (
	<div>Aguarde, carregando...</div>
);

const App = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container maxWidth="xl" disableGutters>
				<Suspense fallback={<LoadingMessage />}>
					<Menu />
					<Routes />
					<Back />
					<Footer />
				</Suspense>
			</Container>
		</ThemeProvider>
	);
};

export default App;
