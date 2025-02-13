import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp.jsx";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
import SocialMetaTags from "../Components/SocialMetaTags.jsx";
import { Box } from "@mui/material";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));

const LatestPhotos = () => {
	const [galleryData, setGalleryData] = useState(null);
	const instance = CreateFlickrApp();

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
						width: "98%",
						alignContent: "center",
						alignItems: "center",
						margin: "0 auto",
					}}
				>
					<SocialMetaTags title={title} image={logo} description={description} />
					{galleryData ? <PhotoGrid itemData={galleryData} /> : <LoadingMessage />}
				</Box>
			</Suspense>
		</>
	);
};

export default React.memo(LatestPhotos);
