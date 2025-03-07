import React, { lazy, useState, useEffect } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
const Routes = lazy(() => import("./Routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));
const Menu = lazy(() => import("./Views/Menu"));
const RandomAffiliateAd = lazy(() => import("./Views/RandomContent"));

const lightTheme = createTheme({
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
			<ThemeProvider theme={lightTheme}>
				<CssBaseline />
				<Menu />
				<Routes />
				<RandomAffiliateAd />
				<ProTip />
				<SocialShareBar url={urlAtual} title="Confira o meu trabalho!" />
				<Back />
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default React.memo(App);
