import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const instance = useMemo(() => CreateFlickrApp(), []);

	const metaData = useMemo(() => {
		if (galleryData) {
			return {
				title: galleryData.title,
				description: galleryData.description,
				url: galleryData.url
			};
		}	
	}, [galleryData]);

	const fetchData = useCallback(async () => {
		const data = await instance.getPhotoInfo(id);
		setGalleryData(data);
	}, [id, instance]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
				<PhotoDashboard photoData={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default React.memo(PhotoInfo);
