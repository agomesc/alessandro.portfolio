import React, { useMemo, lazy } from "react";
import { Typography, Box, Paper } from "@mui/material";

import SocialMetaTags from "../Components/SocialMetaTags";
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Privacidade = () => {
    const description = useMemo(
        () =>
            `Política de Privacidade e Termos de Uso

A sua privacidade é de extrema importância para mim. O site OlhoFotográfico é meu portfólio pessoal, onde compartilho minha paixão pela fotografia, e também uma plataforma para exibir e vender meu trabalho.

**Coleta e Uso de Dados Pessoais**

Eu **não coleto seus dados pessoais**, como nome ou e-mail, ao navegar pelo site. Você pode visualizar meu portfólio de forma totalmente anônima.

**Uso de Cookies e Tecnologias de Rastreamento**

O site **não utiliza cookies ou qualquer outra tecnologia de rastreamento** para monitorar sua navegação.

**Links Externos**

Meu site pode conter links para sites de terceiros, como plataformas de vendas de fotos ou redes sociais. Fique ciente de que não sou responsável pelas políticas de privacidade ou conteúdo desses sites.

**Compromisso do Usuário**

Ao usar este site, você se compromete a fazer um uso adequado dos conteúdos e das informações, e a não se envolver em atividades que:
A) Sejam ilegais ou contrárias à boa fé e à ordem pública.
B) Difundam propaganda racista, xenofóbica, de jogos de azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos.
C) Causem danos aos sistemas (hardware e software) do OlhoFotográfico, de fornecedores ou de terceiros, incluindo a introdução de vírus ou outros sistemas prejudiciais.

**Informações sobre Vendas**

As fotos exibidas no portfólio podem estar disponíveis para compra. Se você tiver interesse em adquirir alguma imagem, pode entrar em contato comigo para mais detalhes.

Se você tiver alguma dúvida sobre esta política, sinta-se à vontade para entrar em contato.

Esta política é efetiva a partir de 5 de agosto de 2025 às 9:45.`,
        []
    );

    const title = "Política de Privacidade";

    return (
        <>
            <SocialMetaTags
                title={title}
                image="../../public/logo_192.png"
                description={description}
            />

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
                <Paper
                    elevation={3}
                    sx={{
                        whiteSpace: "pre-wrap",
                        textAlign: "justify",
                        p: 5,
                        boxShadow: 0,
                    }}
                >
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