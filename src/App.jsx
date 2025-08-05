import { lazy, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./Views/Theme";
import Box from "@mui/material/Box";
import "./App.css";


const Routes = lazy(() => import("./Routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const NavigationButtons = lazy(() => import("./Components/NavigationButtons"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Components/Footer"));
const Menu = lazy(() => import("./Views/Menu"));
// const LojaDeFotos = lazy(() => import("./Views/LojaDeFotos"));
const ViewComponent = lazy(() => import("./Components/ViewComponent"));
const FollowComponent = lazy(() => import("./Components/FollowComponent"));

const App = () => {
	const location = useLocation();
	const [urlAtual, setUrlAtual] = useState('');
	const [darkMode, setDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem('darkMode');
		return savedTheme ? JSON.parse(savedTheme) : false;
	});

	useEffect(() => {
		window.scrollTo(0, 0);
		setUrlAtual(window.location.href);
	}, [location]);

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
			<Menu darkMode={darkMode} toggleTheme={toggleTheme} />
			<Routes />
			<NavigationButtons />
			{/* <LojaDeFotos /> */}
			
			<FollowComponent entityId="1" />
				<SocialShareBar url={urlAtual} title="Compartilhe este site!" />		
			<ProTip />
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
				<ViewComponent id="Gallery" />
			</Box>
			
			
			
			<Footer darkMode={darkMode} />
		</ThemeProvider>
	);
};

export default App;
