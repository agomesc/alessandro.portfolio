import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
import SocialMetaTags from "../Components/SocialMetaTags";
import Box from "@mui/material/Box";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const LatestPhotos = () => {
	const [galleryData, setGalleryData] = useState(null);
	const instance = useMemo(() => CreateFlickrApp(), []);

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getLatestPhotos();
			setGalleryData(data);
		}
		if (!galleryData) fetchData();
	}, [galleryData, instance]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	const title = 'Atualizações';
	const description = 'Últimas Atualizações';

	return (
		<>

			<Suspense fallback={<LoadingMessage />}>
				<Box
					sx={{
						p: 0,
						width: { xs: "100%", sm: "90%" },
						alignContent: "center",
						alignItems: "center",
						margin: "0 auto",
					}}
				>
					<TypographyTitle src="Atualizações" />
					{galleryData ? <PhotoGrid itemData={galleryData} /> : <LoadingMessage />}
				</Box>
			</Suspense>
			<SocialMetaTags title={title} image={logo} description={description} />
		</>
	);
};

export default React.memo(LatestPhotos);
