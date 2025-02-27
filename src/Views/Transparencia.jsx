import { React, lazy } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Link from "@mui/material/Link";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Transparencia = () => {
  return (
    <Box
      sx={{
        p: 0,
        width: "90%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        marginBottom: 30
      }}
    >
      <TypographyTitle src="Página de Transparência" />
      <Paper elevation={3} sx={{ whiteSpace: 'pre-wrap', textAlign: "justify", p: 5 }}>
        <Typography variant="subtitle1">Quem Somos</Typography>
        <Typography paragraph>
          Somos apaixonados por fotografia e nosso site é dedicado a compartilhar nosso trabalho com o mundo. (Alessandro Portfólio.)
        </Typography>

        <Typography variant="subtitle1">Contato</Typography>
        <Typography paragraph>
          Para qualquer dúvida ou informações, entre em contato conosco através do e-mail: olhofotografico@outlook.com.
        </Typography>

        <Typography variant="subtitle1">Política de Privacidade</Typography>
        <Typography paragraph>
          Valorizamos a privacidade dos nossos visitantes. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography variant="subtitle1">Termos de Serviço</Typography>
        <Typography paragraph>
          Ao acessar nosso site, você concorda com nossos termos de serviço. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography variant="subtitle1">Monetização</Typography>
        <Typography paragraph>
          Nosso site é monetizado através de anúncios do Google AdSense e outras parcerias publicitárias. (Os anúncios são integrados ao conteúdo.)
        </Typography>

        <Typography variant="subtitle1">Direitos Autorais</Typography>
        <Typography paragraph>
          O conteúdo deste site é protegido por direitos autorais.
        </Typography>
      </Paper>
    </Box>
  );
};

export default React.memo(Transparencia);
