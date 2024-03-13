import ImageMasonry from "../Components/ImageMasonry";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const instance = CreateFlickrApp();

  useEffect(() => {
    async function fetchData() {
      const data = await instance.getGallery();
      setGalleryData(data);
    }
    if (galleryData.length === 0) fetchData();
  }, [galleryData, instance]);

  return( <ImageMasonry data={galleryData} />)
};

export default Gallery;
