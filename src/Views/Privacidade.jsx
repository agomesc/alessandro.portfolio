import React, { Suspense, useMemo } from "react";
import { Typography, Box, Paper } from "@mui/material";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
import SocialMetaTags from "../Components/SocialMetaTags";


const Privacidade = () => {
    const descricao = useMemo(() => `Política Privacidade
    A sua privacidade é importante para nós. É política do Alessandro Portfólio respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Alessandro Portfólio, e outros sites que possuímos e operamos.

    Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.

    Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.

    Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.

    O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.

    Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.

    O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.

    Compromisso do Usuário
    O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Alessandro Portfólio oferece no site e com caráter enunciativo, mas não limitativo:

    A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;
    B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, pixbet ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
    C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Alessandro Portfólio, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.
    Mais informações
    Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.

    Esta política é efetiva a partir de 24 March 2024 20:53`, []);

    const title = 'Privacidade';

    return (
        <>
            <SocialMetaTags title={title} url={logo} description={descricao} />
            <Suspense fallback={<LoadingMessage />}>
                <Box
                    sx={{
                        p: 0,
                        width: "98%",
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography sx={{ mt: 10, mb: 3 }} variant="h4">Política de Privacidade e Termos de Uso</Typography>
                    <Paper elevation={3} sx={{ whiteSpace: 'pre-wrap', textAlign: "justify", p: 5 }}>
                        {descricao}
                    </Paper>
                </Box>
            </Suspense>
        </>
    );
};

export default React.memo(Privacidade);
