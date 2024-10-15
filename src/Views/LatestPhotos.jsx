import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
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
		fetchData();
	}, [instance]);

	if (!galleryData) {
		return <LoadingMessage />;
	}


	const title = 'Atualizações';
	const description = 'Últimas Atualizações';

	return (
		<>
			<SocialMetaTags title={title} url={logo} description={description} />
			<Suspense fallback={<LoadingMessage />}>
				{galleryData ? <PhotoGrid itemData={galleryData} /> : <LoadingMessage />}
			</Suspense>
		</>
	);
};

export default LatestPhotos;
