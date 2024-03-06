import React, { useEffect, useState } from "react";
import ImageMasonry from "./ImageMasonry";
import FlickrApp from "../shared/FlickrApp";
import Container from "@mui/material/Container";

const Main = () => {
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

  return (
      <ImageMasonry data={galleryData} />
  );
};

export default Main;
