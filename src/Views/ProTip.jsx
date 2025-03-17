import React, { useMemo } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home'; // Importando ícones adicionais


const ProTip = () => {
	const linkContent = useMemo(() => (
		<>
			Flickr API
		</>
	), []);

	return (
		<Box sx={{ mt: 15, pt: 10, display: "flex", justifyContent: "center" }}>
			<Paper elevation={1} sx={{ boxShadow: 0, border: 0 }}>
				<Typography component="div" sx={{ mt: 2, mb: 2, p: 1, justifyContent: "center" }} color="text.secondary">
					<Typography component="div" variant="subtitle1" sx={{ textAlign: "center" }}>
						<HomeIcon sx={{ mr: 1 }} /> Olhofotográfico / Alessandro Portfólio
					</Typography>
					<Typography component="div" variant="caption" sx={{ textAlign: "center" }}>
						Desenvolvedor: Alessandro G
					</Typography>
					<Typography component="div" variant="caption" sx={{ textAlign: "center" }}>
						Todos os direitos reservados.
					</Typography>
					<Typography component="div" variant="caption" sx={{ textAlign: "center" }}>
						<Link target="_blank" rel="noopener noreferrer" href="https://www.flickr.com/services/api/">{linkContent}</Link>
					</Typography>
					<Typography component="div" variant="caption" sx={{ textAlign: "center" }}>
						<Link target="_blank" rel="noopener noreferrer" href="https://firebase.google.com/?hl=pt-br">Firebase</Link>
					</Typography>
					<Typography component="div" variant="caption" sx={{ textAlign: "center" }}>
						<Link target="_blank" rel="noopener noreferrer" href="https://vercel.com/">Vercel</Link>
					</Typography>
				</Typography>
			</Paper>
		</Box>
	);
}

export default React.memo(ProTip);