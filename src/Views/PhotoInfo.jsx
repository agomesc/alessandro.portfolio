import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const LoadingMessage = () => (
	<div>Aguarde, carregando...</div>
);

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