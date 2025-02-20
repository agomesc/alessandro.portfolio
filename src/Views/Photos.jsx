import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";
import { Typography, Box } from "@mui/material";

const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
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
						width: "98%",
						alignContent: "center",
						alignItems: "center",
						margin: "0 auto",
					}}
				>
					<Typography sx={{ mt: 10, mb: 3 }} variant="h4">
						Minhas Fotos
					</Typography>
					<SocialMetaTags
						title={metaData.title}
						image={metaData.url}
						description={metaData.description}
					/>
					<PhotoGallery photos={galleryData} />
					<CommentBox itemID={id} />
				</Box>
			</Suspense>
		</>
	);
};

export default React.memo(Photos);
