import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";


const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

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
	}, [galleryData, id, instance]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>
			{/* Renderiza apenas quando os dados estão prontos */}
			<SocialMetaTags
				title={galleryData.title || "Default Title"}
				description={galleryData.description || "Default description"}
				url={galleryData.url || "default-image-url.jpg"}
			/>

			<Suspense fallback={<LoadingMessage />}>
				<PhotoDashboard photoData={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default PhotoInfo;
