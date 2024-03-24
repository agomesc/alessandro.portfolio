import ImageMasonry from "../Components/ImageMasonry";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState } from "react";
import CommentBox from "../Components/comments";

const Gallery = () => {
	const [galleryData, setGalleryData] = useState([]);
	const instance = CreateFlickrApp();

	useEffect(() => {
		async function fetchData() {
			const data = await instance.getGallery();
			setGalleryData(data);
		}
		fetchData();
	}, [galleryData, instance]);

	return (<><ImageMasonry data={galleryData} />
		<CommentBox itemID="Gallery" /></>)
};

export default React.memo(Gallery);
