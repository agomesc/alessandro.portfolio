import ImageMasonry from "../Components/ImageMasonry";
import FlickrApp from "../shared/FlickrApp";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetGallery();
      setGalleryData(data);
    }
    fetchData();
  }, [galleryData]);

  return (<ImageMasonry data={galleryData} />);
};
export default Gallery;