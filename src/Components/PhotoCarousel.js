import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const PhotoCarousel = ({ photos }) => {
  return (
    <Carousel>
      {photos.map((photo, index) => (
        <Paper key={index}>
          <img src={photo.url} alt={`Photo ${index}`} />
        </Paper>
      ))}
    </Carousel>
  );
};

export default PhotoCarousel;
