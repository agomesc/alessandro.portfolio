import React, { lazy, useState, useEffect } from 'react';
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Routes = lazy(() => import("./routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));
const Menu = lazy(() => import("./Views/Menu"));

const darkTheme = createTheme({
	palette: {
		mode: "light",
	},
});

const App = () => {
	const [urlAtual, setUrlAtual] = useState('');

	useEffect(() => {
		setUrlAtual(window.location.href);
	}, []);

	return (
		<>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<Menu />
				<Routes />
				<ProTip />
				<SocialShareBar url={urlAtual} title="Confira o meu trabalho!" />
				<Back />
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default React.memo(App);
