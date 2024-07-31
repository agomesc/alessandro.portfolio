import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png"

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

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