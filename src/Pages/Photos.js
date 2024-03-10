import React, { useEffect, useState } from "react";
import FlickrApp from "../shared/FlickrApp";
import PhotoGallery from "../Components/PhotoGallery";
import { useParams } from "react-router-dom";

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";

  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetPhotos(id);
      setGalleryData(data);
    }
    fetchData();
  }, [galleryData, id]);

  return <PhotoGallery photos={galleryData} />;
};

export default Photos;
