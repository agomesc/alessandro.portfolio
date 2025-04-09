import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
import Box from "@mui/material/Box";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CommentBox = lazy(() => import("../Components/CommentBox"));

const LatestPhotos = () => {
	const [galleryData, setGalleryData] = useState(null);
	const instance = useMemo(() => CreateFlickrApp(), []);

	useEffect(() => {
		if (!galleryData) {
			instance.getLatestPhotosMedium().then(setGalleryData);
		}
	}, [galleryData, instance]);

	if (!galleryData) return <LoadingMessage />;

	const title = 'Atualizações';
	const description = 'Últimas Atualizações';

	return (
		<Suspense fallback={<LoadingMessage />}>
			<Box
				sx={{
					p: 0,
					width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
					alignContent: "center",
					alignItems: "center",
					margin: "0 auto",
					padding: "0 20px",
				}}
			>
				<TypographyTitle src="Atualizações" />
				<PhotoGrid itemData={galleryData} />
				<CommentBox itemID="LatestPhotos" />
			</Box>

			<SocialMetaTags title={title} image={logo} description={description} />
		</Suspense>
	);
};

export default React.memo(LatestPhotos);
