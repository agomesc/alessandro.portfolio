import React, { useEffect, useState } from "react";
import FlickrApp from "../shared/FlickrApp";
import PhotoGallery from "../Components/PhotoGallery";
import { useParams, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    async function fetchData() {
      const flickrApp = new FlickrApp(apiKey);
      const data = await flickrApp.GetPhotos(id);
      setGalleryData(data);
    }
    fetchData();
  }, [galleryData, id]);

  return (
    <>
      <IconButton
        style={{ position: "absolute", top: "8%", right: "10%" }}
        onClick={handleGoBack}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <PhotoGallery photos={galleryData} />
    </>
  );
};

export default Photos;
