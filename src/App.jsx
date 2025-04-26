import React, { lazy, useState, useEffect } from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { lightTheme, darkTheme } from "./Views/Theme";


const Routes = lazy(() => import("./Routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Components/Footer"));
//const PushNotification = lazy(() => import("./Components/PushNotification"));
const Menu = lazy(() => import("./Views/Menu"));
const RandomAffiliateAd = lazy(() => import("./Views/RandomContent"));
const MessageSnackbar = lazy(() => import("./Components/MessageSnackbar"));


const App = () => {
	const [urlAtual, setUrlAtual] = useState('');
	const [darkMode, setDarkMode] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("info");

	useEffect(() => {
		setUrlAtual(window.location.href);
	}, []);

	useEffect(() => {
		document.body.classList.toggle("dark-mode", darkMode);
		document.body.classList.toggle("light-mode", !darkMode);
	}, [darkMode]);

	useEffect(() => {
		if (window.webkitNotifications) {
			window.webkitNotifications.requestPermission((permission) => {
				if (permission === "granted") {
					setSnackbarMessage("Permissão concedida!");
					setSnackbarSeverity("success");
					setSnackbarOpen(true);
				} else {
					setSnackbarMessage("Permissão negada.");
					setSnackbarSeverity("error");
					setSnackbarOpen(true);
				}
			});
		} else {
			setSnackbarMessage("API de Notificações não é suportada neste navegador.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	}, []);


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
			{/* <PushNotification /> */}
			<Footer darkMode={darkMode} />
		</ThemeProvider>
	);
};

export default React.memo(App);
