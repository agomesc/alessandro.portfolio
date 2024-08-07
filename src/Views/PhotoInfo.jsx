import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";


const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {

	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, id, instance]);

	return (<>
		<SocialMetaTags title={galleryData?.title} url={window.location.href} description={galleryData?.description} imageUrl={galleryData?.url} />
		<Suspense fallback={<LoadingMessage />}>
			<PhotoDashboard photoData={galleryData} />
			<CommentBox itemID={id} />
		</Suspense>
	</>);
};

export default PhotoInfo;