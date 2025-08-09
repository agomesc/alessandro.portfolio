import React, { Suspense } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";

const ViewComponent = React.lazy(() => import("../Components/ViewComponent"));
const CustomSkeleton = React.lazy(() => import("../Components/CustomSkeleton"));

const ProTip = () => {
	return (
		<Box
			sx={{
				pt: 15,
				mb: 15,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				textAlign: "center",
			}}
		>
			<Paper
				elevation={1}
				sx={{
					boxShadow: 0,
					border: 0,
					px: 3,
					py: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
				}}
			>
				<Suspense fallback={<CustomSkeleton variant="text" height="10" />}>
					<Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>
						<HomeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
						Olhofotográfico / Alessandro Portfólio
					</Typography>
				</Suspense>
				<Suspense fallback={<CustomSkeleton variant="text" height="10" />}>
					<Typography component="div" variant="subtitle2" sx={{ mb: 1 }}>
						Desenvolvido por Alessandro G
					</Typography>
				</Suspense>
				<Suspense fallback={<CustomSkeleton variant="text" height="10" />}>
					<Typography component="div" variant="caption" sx={{ mb: 1 }}>
						Todos os direitos reservados.
					</Typography>
				</Suspense>
				<Suspense fallback={<CustomSkeleton variant="text" height="10" />}>
					{[
						{ label: "React", url: "https://pt-br.legacy.reactjs.org/" },
						{ label: "Flickr API", url: "https://www.flickr.com/services/api/" },
						{ label: "Firebase", url: "https://firebase.google.com/?hl=pt-br" },
						{ label: "Vercel", url: "https://vercel.com/" },
					].map((item, index) => (
						<Typography key={index} component="div" variant="caption">
							<Link target="_blank" rel="noopener noreferrer" href={item.url}>
								{item.label}
							</Link>
						</Typography>
					))}
				</Suspense>
				<Suspense fallback={<CustomSkeleton variant="text" height="10" />}>
					<Typography component="div" variant="caption" sx={{ mb: 1 }}>
						<ViewComponent id="Gallery" />
					</Typography>
				</Suspense>
			</Paper>
		</Box>
	);
};

export default ProTip;