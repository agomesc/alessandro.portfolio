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
	const [galleryInfoData, setGalleryInfoData] = useState("");
	const instance = useMemo(() => CreateFlickrApp(), []);

	const metaData = useMemo(() => {
		if (galleryData?.length > 0) {
			const randomIndex = Math.floor(Math.random() * galleryData.length);
			const randomItem = galleryData[randomIndex];
			return {
				title: randomItem.title || "Galeria de Fotos",
				image: randomItem.url || "",
				description: randomItem.title || "Veja as fotos dessa galeria."
			};
		}
		return {
			title: "Galeria de Fotos",
			image: "",
			description: "Veja as fotos dessa galeria."
		};
	}, [galleryData]);

	const fetchData = useCallback(async () => {
		const data = await instance.getPhotosLarge(id);
		setGalleryData(data);

		const albumInfo = await instance.getAlbum(id);
		setGalleryInfoData(albumInfo?.description?._content || "");
	}, [id, instance]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<Box
					sx={{
						p: 0,
						width: {
							xs: "100%", // Para telas extra pequenas (mobile)
							sm: "90%",  // Para telas pequenas
							md: "80%",  // Para telas médias
							lg: "70%",  // Para telas grandes
							xl: "80%"   // Para telas extra grandes
						},
						alignContent: "center",
						alignItems: "center",
						margin: "0 auto",
						padding: "0 20px",
						mt: 10
					}}
				>
					<TypographyTitle src="Minhas Fotos" />
					<Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
						{galleryInfoData}
					</Typography>
					<PhotoGallery photos={galleryData} />
					<CommentBox itemID={id} />
				</Box>
			</Suspense>

			<SocialMetaTags
				title={metaData.title}
				image={metaData.image}
				description={metaData.description}
			/>
		</>
	);
};

export default React.memo(Photos);
