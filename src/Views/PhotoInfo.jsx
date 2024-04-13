import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);
		}
		fetchData();
	}, [galleryData, id, instance]);
	
	return (<>
	<Suspense fallback={<LoadingMessage />}>
		<PhotoDashboard photoData={galleryData} />
		<CommentBox itemID={id} />
		</Suspense>
	</>);
};

export default  React.memo(PhotoInfo);