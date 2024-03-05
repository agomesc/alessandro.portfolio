import React, { useEffect, useState } from "react";
import PhotoCarousel from "./Components/PhotoGallery";
import FlickrApp from "./shared/FlickrApp";
const PhotoGallery = (obj) => {
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetPhotos(obj.id);
      setGalleryData(data);
    }
    fetchData();
  }, [galleryData, obj.id]);

  return <PhotoCarousel photos={galleryData} />;
};

export default PhotoGallery;
