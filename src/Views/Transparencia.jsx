import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Link from "@mui/material/Link";

const Transparencia = () => {
  return (
    <Box
      sx={{
        p: 0,
        width: "80%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        marginBottom: 30
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Transparência
      </Typography>
    <Paper elevation={3}>
      <Typography variant="h4" gutterBottom>
        Página de Transparência
      </Typography>
      <Box marginBottom={2}>
        <Typography variant="h6">Quem Somos</Typography>
        <Typography paragraph>
          Somos apaixonados por fotografia e nosso site é dedicado a compartilhar nosso trabalho com o mundo. (Alessandrp Portfólio.)
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h6">Contato</Typography>
        <Typography paragraph>
          Para qualquer dúvida ou informações, entre em contato conosco através do e-mail: olhofotografico@outlook.com.
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h6">Política de Privacidade</Typography>
        <Typography paragraph>
          Valorizamos a privacidade dos nossos visitantes. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h6">Termos de Serviço</Typography>
        <Typography paragraph>
          Ao acessar nosso site, você concorda com nossos termos de serviço. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h6">Monetização</Typography>
        <Typography paragraph>
          Nosso site é monetizado através de anúncios do Google AdSense e outras parcerias publicitárias. (Os anúncios são integrados ao conteúdo.)
        </Typography>
      </Box>
      <Box marginBottom={2}>
        <Typography variant="h6">Direitos Autorais</Typography>
        <Typography paragraph>
          O conteúdo deste site é protegido por direitos autorais.
        </Typography>
      </Box>
    </Paper>
    </Box>
  );
};

export default Transparencia;
