import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy } from "react";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));

const Gallery = () => {
	const [galleryData, setGalleryData] = useState(null);
	const [metaData, setMetaData] = useState({
		title: "Alessandro Gomes Portfólio",
		description: "Alessandro Gomes Portfólio",
		url: "%PUBLIC_URL%/logo_512.png"
	});

	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);

			if (data.length > 0) {
				const randomIndex = Math.floor(Math.random() * data.length);
				const randomItem = data[randomIndex];
				setMetaData({
					title: randomItem.title,
					description: randomItem.description,
					url: randomItem.img
				});
			}
		}

		if (!galleryData) fetchData();
	}, [galleryData, instance]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<SocialMetaTags
					title={metaData.title}
					description={metaData.description}
					url={metaData.url}
				/>
				<ImageMasonry data={galleryData} />
				<CommentBox itemID="Gallery" />
			</Suspense>
		</>
	);
};

export default Gallery;
