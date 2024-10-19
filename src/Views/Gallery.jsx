import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy } from "react";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));

const Gallery = () => {
	const [galleryData, setGalleryData] = useState(null);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);
		}
		if (!galleryData) fetchData();
	}, [galleryData, instance]);

	// Adiciona uma verificação se galleryData ainda está null ou indefinido
	if (!galleryData) {
		return <LoadingMessage />;
	}

	// Garante que existe pelo menos um item no array antes de calcular o randomIndex
	const randomIndex = galleryData.length > 0 ? Math.floor(Math.random() * galleryData.length) : 0;
	const randomItem = galleryData[randomIndex];

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<SocialMetaTags
					title={randomItem?.title || "Default Title"}
					description={randomItem?.description || "Default description"}
					url={randomItem?.img || "default-image-url.jpg"}
				/>
				{galleryData ? <ImageMasonry data={galleryData} /> : <LoadingMessage />}
				<CommentBox itemID="Gallery" />
			</Suspense>
		</>
	);
};

export default Gallery;
