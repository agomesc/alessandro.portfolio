import React, { useEffect, useState } from "react";
import Main from "./Components/main";
import Menu from "./Components/menu";
import Container from "@mui/material/Container";
import ImageMasonry from "./Components/ImageMasonry";
import FlickrApp from "./shared/FlickrApp";

const App = () => {
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
  }, []);

  return (
    <Container maxWidth={true} disableGutters>
      <Menu />
      <Main />
      <ImageMasonry />
    </Container>
  );
};

export default App;
