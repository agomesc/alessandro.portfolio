import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";


const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotos(id);
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, id, instance]);

	const randomIndex = Math.floor(Math.random() * galleryData.length);
	const randomItem = galleryData[randomIndex];

	return (<>
		<SocialMetaTags title={randomItem?.title} url={window.location.href} description={randomItem?.title} imageUrl={randomItem?.url} />
		<Suspense fallback={<LoadingMessage />}>
			<PhotoGallery photos={galleryData} />
			<CommentBox itemID={id} />
		</Suspense>
	</>);
};

export default Photos;
