import React, { lazy, useState, useEffect } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { lightTheme, darkTheme } from "./Views/Theme";
import Box from "@mui/material/Box";

const Routes = lazy(() => import("./Routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Components/Footer"));
const Menu = lazy(() => import("./Views/Menu"));
const RandomAffiliateAd = lazy(() => import("./Views/RandomContent"));
const ViewComponent = lazy(() => import("./Components/ViewComponent"));

const App = () => {
	const [urlAtual, setUrlAtual] = useState('');
	const [darkMode, setDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem('darkMode');
		return savedTheme ? JSON.parse(savedTheme) : false;
	});

	useEffect(() => {
		setUrlAtual(window.location.href);
	}, []);

	useEffect(() => {
		localStorage.setItem('darkMode', JSON.stringify(darkMode));
		document.body.classList.toggle("dark-mode", darkMode);
		document.body.classList.toggle("light-mode", !darkMode);
	}, [darkMode]);

	const toggleTheme = () => {
		setDarkMode(prev => !prev);
	};

	return (
		<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<Menu darkMode={darkMode} toggleTheme={toggleTheme} />
			<Routes />
			<RandomAffiliateAd />
			<ProTip />
			<SocialShareBar url={urlAtual} title="Confira o meu trabalho!" />
			<Back />
			<Box sx={{ display: 'flex', justifyContent: 'center', p:10 }}>
				<ViewComponent id="Gallery"/> 
			</Box>           
			{/* <PushNotification /> */}
			<Footer darkMode={darkMode} />
		</ThemeProvider>
	);
};

export default React.memo(App);
