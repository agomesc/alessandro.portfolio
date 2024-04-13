import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));

const LoadingMessage = () => (
	<div>Aguarde, carregando...</div>
);

const LatestPhotos = () => {
	
		const [galleryData, setGalleryData] = useState([]);
		const instance = CreateFlickrApp();
	
		useEffect(() => {
			async function fetchData() {
				const data = await instance.getLatestPhotos();
				setGalleryData(data);
			}
			fetchData();
		}, [galleryData, instance]);
	
		return (
		<div>
			<Suspense fallback={<LoadingMessage />}>
				<PhotoGrid itemData={galleryData} />
			</Suspense>
		</div>
	);
};

export default  React.memo(LatestPhotos);