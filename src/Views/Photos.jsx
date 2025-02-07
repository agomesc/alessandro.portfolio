import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const instance = useMemo(() => CreateFlickrApp(), []);

	const metaData = useMemo(() => {
		if (galleryData && galleryData.length > 0) {
			const randomIndex = Math.floor(Math.random() * galleryData.length);
			const randomItem = galleryData[randomIndex];
			return {
				title: randomItem.title,
				description: randomItem.title,
				url: randomItem.url
			};
		}
	
	}, [galleryData]);

	const fetchData = useCallback(async () => {
		const data = await instance.getPhotos(id);
		setGalleryData(data);
	}, [id, instance]);

	useEffect(() => {
		if (!galleryData) fetchData();
	}, [fetchData, galleryData]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				{/* <SocialMetaTags
					title={metaData.title}
					description={metaData.description}
					url={metaData.url}
				/> */}
				<PhotoGallery photos={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default React.memo(Photos);
