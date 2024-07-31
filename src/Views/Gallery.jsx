
import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy } from "react";
import LoadingMessage from "../Components/LoadingMessage";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Gallery = () => {
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, instance]);

	const randomIndex = Math.floor(Math.random() * galleryData.length);
	const randomItem = galleryData[randomIndex];

	return (<>

		<SocialMetaTags title={randomItem?.title}
			url={window.location.href}
			description={randomItem?.description}
			imageUrl={randomItem?.img}
		/>
		<Suspense fallback={<LoadingMessage />}>
			<ImageMasonry data={galleryData} />
			<CommentBox itemID="Gallery" />
		</Suspense></>)
};

export default Gallery;
