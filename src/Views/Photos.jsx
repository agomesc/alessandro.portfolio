import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const [metaData, setMetaData] = useState({
		title: "Alessandro Gomes Portfólio",
		description: "Alessandro Gomes Portfólio",
		url: "%PUBLIC_URL%/logo_512.png"
	});

	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotos(id);
			setGalleryData(data);

			if (data.length > 0) {
				const randomIndex = Math.floor(Math.random() * data.length);
				const randomItem = data[randomIndex];
				setMetaData({
					title: randomItem.title,
					description: randomItem.title,
					url: randomItem.url
				});
			}
		}

		if (!galleryData) fetchData();
	}, [galleryData, id, instance]);

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
				<PhotoGallery photos={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default Photos;
