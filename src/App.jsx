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
			<div style={{ position: "fixed", top: 12, right: 105, zIndex: 9999 }}>
				<IconButton
					onClick={toggleTheme}
					style={{
						backgroundColor: darkMode ? '#333333' : '#f0f0f0', // Fundo para contraste
						color: darkMode ? '#ffffff' : '#000000', // Cor do ícone ajustada
						borderRadius: '50%', // Apenas para melhorar o estilo
					}}
				>
					{darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
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
