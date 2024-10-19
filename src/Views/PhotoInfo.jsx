import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);
		}
		if (!galleryData) fetchData();
	}, [galleryData, id, instance]); // Remove galleryData from dependencies

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>

			<Suspense fallback={<LoadingMessage />}>
				<SocialMetaTags
					title={galleryData.title || "Default Title"}
					description={galleryData.description || "Default description"}
					url={galleryData.url || "default-image-url.jpg"}
				/>
				<PhotoDashboard photoData={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default PhotoInfo;
