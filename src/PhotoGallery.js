import React, { useEffect, useState } from "react";
import PhotoCarousel from "./Components/PhotoCarousel";
import FlickrApp from "../src/shared/FlickrApp";
const PhotoGallery = () => {
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetPhotos("72177720309320894");
      setGalleryData(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Meu Carrossel de Fotos</h1>
      <PhotoCarousel photos={galleryData} />
    </div>
  );
};

export default PhotoGallery;
