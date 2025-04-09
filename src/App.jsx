import React, { lazy, useState, useEffect } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { lightTheme, darkTheme } from "./Views/Theme";
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Lazy imports
const Routes = lazy(() => import("./Routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));
const Menu = lazy(() => import("./Views/Menu"));
const RandomAffiliateAd = lazy(() => import("./Views/RandomContent"));

const App = () => {
	const [urlAtual, setUrlAtual] = useState('');
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setUrlAtual(window.location.href);
	}, []);

	const toggleTheme = () => {
		setDarkMode(prev => !prev);
	};

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<div style={{ position: "fixed", top: 10, right: 2, zIndex: 9999 }}>
				<IconButton onClick={toggleTheme} color="inherit">
					{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
				</IconButton>
			</div>

			<Menu />
			<Routes />
			<RandomAffiliateAd />
			<ProTip />
			<SocialShareBar url={urlAtual} title="Confira o meu trabalho!" />
			<Back />
			<Footer />
		</ThemeProvider>
	);
};

export default React.memo(App);
