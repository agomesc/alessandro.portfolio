import { lazy } from 'react';
import { Paper, Typography } from '@mui/material';
import Link from "@mui/material/Link";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));

const Transparencia = () => {
  return (
    <ContentContainer sx={{ mt: 20 }}>
      <TypographyTitle src="Página de Transparência" />
      <Paper elevation={3} sx={{ whiteSpace: 'pre-wrap', textAlign: "justify", p: 5, border: 0, boxShadow: 0 }}>
        <Typography component="div" variant="subtitle1">Quem Sou?</Typography>
        <Typography paragraph>
          Sou apaixonado por fotografia e criei este site para compartilhar meu trabalho com o mundo. (OlhoFotográfico)
        </Typography>

        <Typography component="div" variant="subtitle1">Contato</Typography>
        <Typography paragraph>
          Para qualquer dúvida ou informação, entre em contato comigo através do e-mail: olhofotografico@outlook.com.
        </Typography>

        <Typography component="div" variant="subtitle1">Política de Privacidade</Typography>
        <Typography paragraph>
          Valorizo a privacidade dos visitantes. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography component="div" variant="subtitle1">Termos de Serviço</Typography>
        <Typography paragraph>
          Ao acessar meu site, você concorda com os termos de serviço. (<Link href="Privacidade">Termo de Serviço e Privacidade</Link>)
        </Typography>

        <Typography component="div" variant="subtitle1">Monetização</Typography>
        <Typography paragraph>
          Este site pode ser monetizado através de anúncios e parcerias publicitárias. (Os anúncios são integrados ao conteúdo.)
        </Typography>

        <Typography component="div" variant="subtitle1">Direitos Autorais</Typography>
        <Typography paragraph>
          Todo o conteúdo deste site é protegido por direitos autorais.
        </Typography>
      </Paper>
    </ContentContainer>
  );
};

export default Transparencia;
