import React, { useMemo } from "react";
import Link from "@mui/material/Link";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';

function LightBulbIcon(props) {
	return (
		<SvgIcon {...props}>
			<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
		</SvgIcon>
	);
}

const ProTip = () => {
	const linkContent = useMemo(() => (
		<>
			Flickr API <LightBulbIcon sx={{ mr: 1, verticalAlign: "center" }} />
		</>
	), []);

	return (
		<Box sx={{ pt: 2, display: "fixed", justifyContent: "center" }}>
			<Paper elevation={3}>
				<Typography sx={{ mt: 2, mb: 2, p: 1 }} color="text.secondary">
					<Typography variant="subtitle1">
						Alessandro Portfólio.
					</Typography>
					<Typography variant="subtitle1">
						Desenvolvedor: Alessandro G
					</Typography>
					<Typography variant="subtitle1">
						Todos os direitos reservados.
					</Typography>
					<Typography variant="subtitle1" sx={{ textAlign: "center" }}>
						<Link href="https://www.flickr.com/services/api/">{linkContent}</Link>
					</Typography>
				</Typography>
			</Paper>
		</Box>
	);
}

export default React.memo(ProTip);
