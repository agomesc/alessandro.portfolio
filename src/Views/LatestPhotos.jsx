import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));

const LatestPhotos = () => {

	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getLatestPhotos();
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, instance]);

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<PhotoGrid itemData={galleryData} />
			</Suspense>
		</>
	);
};

export default LatestPhotos;