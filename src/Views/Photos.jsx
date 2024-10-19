import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/comments"));

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState(null);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotos(id);
			setGalleryData(data);
		}
		if (!galleryData) fetchData();
	}, [galleryData, id, instance]);

	// Verifica se `galleryData` está carregado antes de acessar suas propriedades
	if (!galleryData) {
		return <LoadingMessage />;
	}

	// Garante que o array de fotos não está vazio
	const randomIndex = galleryData.length > 0 ? Math.floor(Math.random() * galleryData.length) : 0;
	const randomItem = galleryData.length > 0 ? galleryData[randomIndex] : {};

	return (
		<>
			<Suspense fallback={<LoadingMessage />}>
				<SocialMetaTags
					title={randomItem?.title || "Default Title"}
					url={randomItem?.url || "default-image-url.jpg"}
					description={randomItem?.title || "Default description"}
				/>

				{galleryData ? <PhotoGallery photos={galleryData} /> : <LoadingMessage />}
				<CommentBox itemID={id} />
			</Suspense>
		</>
	);
};

export default Photos;
