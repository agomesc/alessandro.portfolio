import PhotoDashboard from "../Components/PhotoDashboard"; // Importe o componente
import React, { useEffect, useState } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";

const PhotoInfo = () => {
	const { id } = useParams();
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getPhotoInfo(id);
			setGalleryData(data);
		}
		if (galleryData.length === 0) fetchData();
	}, [galleryData, id, instance]);

	return (<>
		<PhotoDashboard photoData={galleryData} />
		<CommentBox itemID={id} />
	</>);
};

export default PhotoInfo;