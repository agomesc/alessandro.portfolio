import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";

const PhotoCarousel = ({ photos }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Carousel
        autoPlay={true}
        animation="slide"
        navButtonsAlwaysVisible
        height="100vh"
        indicatorContainerProps={{ style: { display: "block" } }}
      >
        {photos.map((photo, index) => (
          <Paper key={index}>
            <img
              src={photo.url}
              alt={`${photo.title}`}
              style={{ maxWidth: "100%" }} // Tornar a imagem responsiva
            />
            <Typography
              maxWidth="xm"
              variant="h2"
              style={{
                position: "absolute",
                top: 20,
                left: 10,
                background: "rgba(255, 255, 255, 0.8)",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              {photo.title}
            </Typography>
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default PhotoCarousel;
