import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png"
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));

const LatestPhotos = () => {

	const [galleryData, setGalleryData] = useState(null);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getLatestPhotos();
			setGalleryData(data);
		}
		if (!galleryData) fetchData();
	}, [galleryData, instance]);

	const title = 'Atualizações';
	const description = 'Últimas Atualizações';

	return (
		<>
			<SocialMetaTags title={title} url={window.location.href} description={description} imageUrl={logo} />
			<Suspense fallback={<LoadingMessage />}>
				<PhotoGrid itemData={galleryData} />
			</Suspense>
		</>
	);
};

export default LatestPhotos;