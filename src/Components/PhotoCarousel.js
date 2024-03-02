import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography } from "@mui/material";

const PhotoCarousel = ({ photos }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Carousel
        autoPlay={true}
        animation="fade"
        navButtonsAlwaysVisible
        indicatorContainerProps={{ style: { display: "block" } }}
      >
        {photos.map((photo, index) => (
          <Paper key={index} style={{ width: "100%" }}>
            <img
              src={photo.url}
              alt={`Photo ${index}`}
              style={{ width: "auto", height: "600px" }}
            />
            <Typography
              variant="h5"
              style={{
                position: "flex-box",
                top: 0,
                left: 5,
                background: "rgba(255, 255, 255, 0.8)",
                padding: "4px",
                borderRadius: "4px",
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
