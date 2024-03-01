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

    console.log("galleryData", galleryData);
  }, [galleryData]);

  return (
    <Container maxWidth="ln">
      <h1>Seja bem-vindo ao meu Portfólio</h1>
      <ImageMasonry data={galleryData} />
    </Container>
  );
};

export default Main;
