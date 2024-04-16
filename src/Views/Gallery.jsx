import ImageMasonry from "../Components/ImageMasonry";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy } from "react";
import LoadingMessage from "../Components/LoadingMessage";

const CommentBox = lazy(() => import("../Components/comments"));

const Gallery = () => {
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, instance]);

	return (<><Suspense fallback={<LoadingMessage />}><ImageMasonry data={galleryData} />
		<CommentBox itemID="Gallery" />
	</Suspense></>)
};

export default React.memo(Gallery);
