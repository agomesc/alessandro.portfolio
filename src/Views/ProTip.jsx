import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';

const ProTip = () => {
	return (
		<Box sx={{ mt: 15, pt: 10, display: "flex", justifyContent: "center" }}>
			<Paper elevation={1} sx={{ boxShadow: 0, border: 0, px: 3, py: 4 }}>
				<Typography component="div" variant="subtitle1" sx={{ textAlign: "center", mb: 1 }}>
					<HomeIcon sx={{ mr: 1 }} /> Olhofotográfico / Alessandro Portfólio
				</Typography>
				<Typography component="div" variant="subtitle2" sx={{ textAlign: "center", mb: 1 }}>
					Desenvolvido por Alessandro G
				</Typography>
				<Typography component="div" variant="caption" sx={{ textAlign: "center", mb: 1 }}>
					Todos os direitos reservados.
				</Typography>

				{[
					{ label: "React", url: "https://pt-br.legacy.reactjs.org/" },
					{ label: "Flickr API", url: "https://www.flickr.com/services/api/" },
					{ label: "Firebase", url: "https://firebase.google.com/?hl=pt-br" },
					{ label: "Vercel", url: "https://vercel.com/" },
				].map((item, index) => (
					<Typography key={index} component="div" variant="caption" sx={{ textAlign: "center" }}>
						<Link target="_blank" rel="noopener noreferrer" href={item.url}>
							{item.label}
						</Link>
					</Typography>
				))}
			</Paper>
		</Box>
	);
};

export default ProTip;