import React, { useEffect, useState } from "react";
import FlickrApp from "../shared/FlickrApp";
import PhotoGallery from "../Components/PhotoGallery";
import { useParams  } from "react-router-dom"; 
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState([]);
  const apiKey = "099c9a89c04c78ec7592650af1d25a7a";
  
  const handleGoBack = () => {
    window.location.href = "/Gallery";    
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
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={handleGoBack} 
      >
        <CloseIcon />
      </IconButton>
      <PhotoGallery photos={galleryData} />;
    </>
  );
};

export default Photos;
