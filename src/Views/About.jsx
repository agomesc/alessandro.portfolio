import React, { Suspense, lazy, useMemo } from 'react';
import Box from "@mui/material/Box";
import minhaImagem from "../images/logo_512.png";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoDescription = lazy(() => import("../Components/PhotoDescription"));
const CommentBox = lazy(() => import("../Components/CommentBox"));

const About = () => {

    const title = 'Sobre?';

    const minhaDescricao = useMemo(() => `
        Me chamo Alessandro, 
        brasileiro, formado em Análise de Sistemas e pós-graduado em Engenharia de Software pela UFRJ, trabalho desde 1994 com tecnologia.
        Minha história com a fotografia começa mais ou menos assim... Minha mãe sempre fotografou, a mim e a meus irmãos, quando éramos crianças, como forma de guardar nossos momentos da infância e no ano de 2003 eu acabei ganhando a minha primeira máquina digital em um bingo numa festa de trabalho. Desde então, nunca mais me desapeguei da fotografia.
        Em 2009, depois de ser pai, acabei levando a coisa mais a sério, pois a brincadeira de fotografar minha filha acabou se tornando uma paixão e quando me dei conta, a fotografia havia ocupado uma parte significativa da minha vida. Fiz cursos de aperfeiçoamento na Canon do Brasil, no Ateliê da Imagem e na Sociedade Fluminense de Fotografia, além de ler livros nos quais pude aprender bastante.
        Hoje sou um amante da fotografia, com muito orgulho, registrando momentos importantes da vida das pessoas e o resultado dessa trajetória está refletido em meu portfólio que apresento a vocês.`, []);

    return (
        <>
            <Box
                sx={{
                    p: 2,
                    width: { xs: "100%", sm: "90%" },
                    margin: "0 auto",
                    textAlign: "justify",
                    padding: "0 20px",
                }}
            >
                <SocialMetaTags title={title} image={minhaImagem} description={minhaDescricao} />
                <Suspense fallback={<LoadingMessage />}>
                    <PhotoDescription imageUrl={minhaImagem} description={minhaDescricao} />
                </Suspense>
            </Box>
            <CommentBox itemID="About" />
        </>
    );
};

export default React.memo(About);
