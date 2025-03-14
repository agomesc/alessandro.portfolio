import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const [galleryInfoData, setGalleryInfoData] = useState(null);
	const instance = useMemo(() => CreateFlickrApp(), []);

	const metaData = useMemo(() => {
		if (galleryData && galleryData.length > 0) {
			const randomIndex = Math.floor(Math.random() * galleryData.length);
			const randomItem = galleryData[randomIndex];
			return {
				title: randomItem.title,
				image: randomItem.url,
				description: randomItem.title
			};
		}

	}, [galleryData]);

	const fetchData = useCallback(async () => {
		const data = await instance.getPhotos(id);

		setGalleryData(data);

		const albumInfo = await instance.getAlbum(id);

		setGalleryInfoData(albumInfo[0].description._content);

	}, [id, instance]);

	useEffect(() => {
		if (!galleryData) fetchData();

	}, [fetchData, galleryData]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

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
					<TypographyTitle src="Minhas Fotos"></TypographyTitle>
					<Typography sx={{ mt: 1, mb: 3 }} variant="subtitle1">
						{galleryInfoData}
					</Typography>
					<PhotoGallery photos={galleryData} />
				</Box>
				<CommentBox itemID={id} />
			</Suspense>
			<SocialMetaTags
				title={metaData.title}
				image={metaData.url}
				description={metaData.description}
			/>
		</>
	);
};

export default React.memo(Photos);
