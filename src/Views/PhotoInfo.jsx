import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const [metaData, setMetaData] = useState({
		title: "Alessandro Gomes Portfólio",
		description: "Alessandro Gomes Portfólio",
		url: "%PUBLIC_URL%/logo_512.png"
	});

	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);

			if (data) {
				setMetaData({
					title: data.title,
					description: data.description,
					url: data.url
				});
			}
		}

		fetchData();
	}, [id, instance]);

	if (!galleryData) {
		return <LoadingMessage />;
	}

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<SocialMetaTags
					title={metaData.title}
					description={metaData.description}
					url={metaData.url}
				/>
				<PhotoDashboard photoData={galleryData} />
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default PhotoInfo;
