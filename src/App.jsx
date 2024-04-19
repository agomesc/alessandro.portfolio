import React, { Suspense, lazy } from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import RandomAffiliateAd from "./Views/RandomAffiliateAd"
import logo from "./images/logo_192.png"

const ProTip = lazy(() => import("./Views/ProTip"));
const Menu = lazy(() => import("./Components/menu"));
const LoadingMessage = lazy(() => import("./Components/LoadingMessage"));
const Routes = lazy(() => import("./routes"));
const Back = lazy(() => import("./Components/Back"));
const Footer = lazy(() => import("./Views/Footer"));
const SocialMetaTags = lazy(() => import("./Components/SocialMetaTags"));

const minhaDescricao = `Me chamo Alessandro, 
		brasileiro, formado em Análise de Sistemas e pós-graduado em Engenharia de Software pela UFRJ, trabalho desde 1994 com tecnologia.
		Minha história com a fotografia começa mais ou menos assim... Minha mãe sempre fotografou, a mim e a meus irmãos, quando éramos crianças, como forma de guardar nossos momentos da infância e no ano de 2003 eu acabei ganhando a minha primeira máquina digital em um bingo numa festa de trabalho. Desde então, nunca mais me desapeguei da fotografia.
		Em 2009, depois de ser pai, acabei levando a coisa mais a sério, pois a brincadeira de fotografar minha filha acabou se tornando uma paixão e quando me dei conta, a fotografia havia ocupado uma parte significativa da minha vida. Fiz cursos de aperfeiçoamento na Canon do Brasil, no Ateliê da Imagem e na Sociedade Fluminense de Fotografia, além de ler livros nos quais pude aprender bastante.
		Hoje sou um amante da fotografia, com muito orgulho, registrando momentos importantes da vida das pessoas e o resultado dessa trajetória está refletido em meu portfólio que apresento a vocês.`;

const title = "Alessandro Portfólio"
const url = window.location.href;

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<SocialMetaTags title={title} description={minhaDescricao} image={logo} url={url} />
			<Container maxWidth="xl" disableGutters>
				<Suspense fallback={<LoadingMessage />}>
					<Menu />
					<Routes />
					<RandomAffiliateAd />
					<Back />
					<ProTip />
					<Footer />
				</Suspense>
			</Container>
		</ThemeProvider>
	);
};

export default App;
