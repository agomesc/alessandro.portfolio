import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotos(id);
			setGalleryData(data);
		}
		fetchData();
	}, [galleryData, id, instance]);

	return (<>
	<Suspense fallback={<LoadingMessage />}>
		<PhotoGallery photos={galleryData} />
		<CommentBox itemID={id} />
		</Suspense>
	</>);
};

export default  React.memo(Photos);
