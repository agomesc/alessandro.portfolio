import React, { lazy } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Link from "@mui/material/Link";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Transparencia = () => {
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
      <TypographyTitle src="Página de Transparência" />
      <Paper elevation={3} sx={{ whiteSpace: 'pre-wrap', textAlign: "justify", p: 5, border: 0, boxShadow: 0 }}>
        <Typography component="div" variant="subtitle1">Quem Somos?</Typography>
        <Typography paragraph>
          Somos apaixonados por fotografia e nosso site é dedicado a compartilhar nosso trabalho com o mundo. (Alessandro Portfólio.)
        </Typography>

        <Typography component="div" variant="subtitle1">Contato</Typography>
        <Typography paragraph>
          Para qualquer dúvida ou informações, entre em contato conosco através do e-mail: olhofotografico@outlook.com.
        </Typography>

        <Typography component="div" variant="subtitle1">Política de Privacidade</Typography>
        <Typography paragraph>
          Valorizamos a privacidade dos nossos visitantes. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography component="div" variant="subtitle1">Termos de Serviço</Typography>
        <Typography paragraph>
          Ao acessar nosso site, você concorda com nossos termos de serviço. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography component="div" variant="subtitle1">Monetização</Typography>
        <Typography paragraph>
          Nosso site é monetizado através de anúncios "Adsense" parcerias publicitárias. (Os anúncios são integrados ao conteúdo.)
        </Typography>

        <Typography component="div" variant="subtitle1">Direitos Autorais</Typography>
        <Typography component="div" paragraph>
          O conteúdo deste site é protegido por direitos autorais.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Transparencia;
