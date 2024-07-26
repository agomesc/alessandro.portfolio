import React, { Suspense, lazy, useState, useEffect } from 'react';
import "./App.css";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// import RandomAffiliateAd from "./Views/RandomAffiliateAd"
import { MetaTagsProvider } from './Components/MetaTagsContext';

const Routes = lazy(() => import("./routes"));
const ProTip = lazy(() => import("./Views/ProTip"));
const Menu = lazy(() => import("./Views/menu"));
const LoadingMessage = lazy(() => import("./Components/LoadingMessage"));
const Back = lazy(() => import("./Components/Back"));
const SocialShareBar = lazy(() => import("./Components/SocialShareBar"));
const Footer = lazy(() => import("./Views/Footer"));
const SocialMetaTags = lazy(() => import("./Components/SocialMetaTags"));

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
				<Suspense fallback={<LoadingMessage />}>
					<MetaTagsProvider>
						<SocialMetaTags />
						<Menu />
						<Routes />
					</MetaTagsProvider>
					<SocialShareBar
						url={urlAtual}
						title="Confira o meu trabalho!"
					/>
					{/* <RandomAffiliateAd /> */}

					<Back />

					<ProTip />
					<Footer />
				</Suspense>
			</Container>
		</ThemeProvider>
	);
};

export default App;
