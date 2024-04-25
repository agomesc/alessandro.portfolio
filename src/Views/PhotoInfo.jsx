import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";
import { useMetaTags } from '../Components/MetaTagsContext';

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {

	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();
	const { setMetaTags } = useMetaTags();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, id, instance]);

	useEffect(() => {
		setMetaTags({
			title: galleryData.title,
			description: galleryData.description,
			image: galleryData.url,
			url: window.location.href
		});
	}, [galleryData.description, galleryData.title, galleryData.url, setMetaTags]);

	return (<>
		<Suspense fallback={<LoadingMessage />}>
			<PhotoDashboard photoData={galleryData} />
			<CommentBox itemID={id} />
		</Suspense>
	</>);
};

export default React.memo(PhotoInfo);