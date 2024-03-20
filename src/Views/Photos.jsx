import React, { useEffect, useState } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import PhotoGallery from "../Components/PhotoGallery";
import { useParams } from "react-router-dom";

const Photos = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotos(id);
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, id, instance]);

	return <PhotoGallery photos={galleryData} />;
};

export default Photos;
