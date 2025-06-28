import { Suspense, lazy, useMemo } from 'react';
import Box from "@mui/material/Box";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoDescription = lazy(() => import("../Components/PhotoDescription"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const About = () => {
    const title = 'Sobre';

    const minhaDescricao = useMemo(() => `
        Me chamo Alessandro, 
        brasileiro, formado em Análise de Sistemas e pós-graduado em Engenharia de Software pela UFRJ, trabalho desde 1994 com tecnologia.
        Minha história com a fotografia começa mais ou menos assim... Minha mãe sempre fotografou, a mim e a meus irmãos, quando éramos crianças, como forma de guardar nossos momentos da infância e no ano de 2003 eu acabei ganhando a minha primeira máquina digital em um bingo numa festa de trabalho. Desde então, nunca mais me desapeguei da fotografia.
        Em 2009, depois de ser pai, acabei levando a coisa mais a sério, pois a brincadeira de fotografar minha filha acabou se tornando uma paixão e quando me dei conta, a fotografia havia ocupado uma parte significativa da minha vida. Fiz cursos de aperfeiçoamento na Canon do Brasil, no Ateliê da Imagem e na Sociedade Fluminense de Fotografia, além de ler livros nos quais pude aprender bastante.
        Hoje sou um amante da fotografia, com muito orgulho, registrando momentos importantes da vida das pessoas e o resultado dessa trajetória está refletido em meu portfólio que apresento a vocês.
        Unindo Paixões: Desenvolvimento e Fotografia e como desenvolvedor, transformar ideias em realidade digital é algo que me motiva todos os dias. Adoro encontrar soluções criativas para desafios e construir projetos que impactem positivamente o mundo.
        Mas minha criatividade não para por aí. Fora do trabalho, a fotografia é minha grande paixão. Por meio das lentes, exploro o mundo sob diferentes perspectivas e capturo momentos que contam histórias únicas.
        Fico muito feliz em compartilhar meu site, onde essas duas paixões se encontram. Enquanto o design e o desenvolvimento me ajudam a construir a plataforma, a fotografia preenche os espaços com arte e emoção. Confira meu portfólio em meu site e descubra um pouco mais sobre esse universo que me inspira. 

    `, []);

    return (
        <Box
            sx={{
                p: 0,
                width: {
                    xs: "100%", // Para telas extra pequenas (mobile)
                    sm: "90%",  // Para telas pequenas
                    md: "80%",  // Para telas médias
                    lg: "70%",  // Para telas grandes
                    xl: "80%"   // Para telas extra grandes
                },
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: "0 20px",
                mt: 10
            }}
        >
            <TypographyTitle src={title} />

            <Suspense fallback={<LoadingMessage />}>
                <PhotoDescription imageUrl="/logo_192.png" description={minhaDescricao} />
            </Suspense>

            <CommentBox itemID="About" />
        </Box>
    );
};

export default About;
