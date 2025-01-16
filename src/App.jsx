import React, { lazy, useState, useEffect } from 'react';
import "./App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Routes = lazy(() => import("./routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Menu = lazy(() => import("./Views/menu"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));
const ArticleCarousel = lazy(() => import("./Views/ArticleCarousel"));

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App = () => {
	const [urlAtual, setUrlAtual] = useState('');

	useEffect(() => {
		setUrlAtual(window.location.href);
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Container maxWidth="xl" disableGutters>
				<Menu />
				<Routes />
				{/* <ArticleCarousel /> */}
				<SocialShareBar url={urlAtual} title="Confira o meu trabalho!" />
				<Back />
				<ProTip />
				<Footer />
			</Container>
		</ThemeProvider>
	);
};

export default React.memo(App);
