import React, { useMemo, lazy } from "react";
import { Typography, Box, Paper } from "@mui/material";

import SocialMetaTags from "../Components/SocialMetaTags";
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Privacidade = () => {
  const description = useMemo(() => `Política de Privacidade

A sua privacidade é importante para mim. É política do OlhoFotográfico respeitar a sua privacidade em relação a qualquer informação sua que eu possa coletar no site www.olhofotografico.com.br, e em outros sites que possuo e opero.

Solicito informações pessoais apenas quando realmente preciso delas para lhe fornecer um serviço. Faço isso por meios justos e legais, com o seu conhecimento e consentimento. Também informo por que estou coletando e como será usada.

Apenas retenho as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazeno dados, protejo-os dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.

Não compartilho informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.

O meu site pode conter links para sites externos que não são operados por mim. Esteja ciente de que não tenho controle sobre o conteúdo e práticas desses sites e não posso aceitar responsabilidade por suas respectivas políticas de privacidade.

Você é livre para recusar minha solicitação de informações pessoais, entendendo que talvez eu não consiga fornecer alguns dos serviços desejados.

O uso continuado do meu site será considerado como aceitação das práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lido com dados de usuários e informações pessoais, entre em contato comigo.

Compromisso do Usuário
O usuário se compromete a fazer uso adequado dos conteúdos e das informações que o OlhoFotográfico oferece no site e, com caráter enunciativo, mas não limitativo:

A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;
B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
C) Não causar danos aos sistemas físicos (hardware) e lógicos (software) do OlhoFotográfico, de meus fornecedores ou de terceiros, nem introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software capazes de causar danos.

Mais informações
Espero que isso esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com algum dos recursos usados em meu site.

Esta política é efetiva a partir de 24 de março de 2024 às 20:53.`, []);

  const title = 'Privacidade';

  return (
    <>
      <SocialMetaTags title={title} image="../../public/logo_192.png" description={description} />

      <Box
        sx={(theme) => ({
          p: 0,
          width: {
            xs: "100%",
            sm: "90%",
            md: "80%",
            lg: "70%",
            xl: "80%",
          },
          alignContent: "center",
          alignItems: "center",
          margin: "0 auto",
          padding: theme.customSpacing.pagePadding,
          mt: theme.customSpacing.sectionMarginTop,
        })}
      >
        <TypographyTitle src="Política de Privacidade e Termos de Uso" />
        <Paper elevation={3} sx={{ whiteSpace: 'pre-wrap', textAlign: "justify", p: 5, boxShadow: 0 }}>
          <Typography variant="body1" component="div">
            {description}
          </Typography>
        </Paper>
        <span id="ezoic-privacy-policy-embed"></span>
      </Box>
    </>
  );
};

export default Privacidade;
