import React, { useEffect, useState } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import PhotoGallery from "../Components/PhotoGallery";
import CommentBox from "../Components/comments";
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
		fetchData();
	}, [galleryData, id, instance]);

	return (<>
		<PhotoGallery photos={galleryData} />
		<CommentBox itemID={id} />
	</>);
};

export default  React.memo(Photos);
