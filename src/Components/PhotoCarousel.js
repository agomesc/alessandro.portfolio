import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const PhotoCarousel = ({ photos }) => {
  return (
    <Carousel
      autoPlay={false} // Desabilita a reprodução automática
      animation="slide" // Define a animação como slide
      navButtonsAlwaysVisible // Mantém os botões de navegação sempre visíveis
      indicatorContainerProps={{ style: { display: "none" } }} // Remove os indicadores de slide
    >
      {photos.map((photo, index) => (
        <Paper key={index} style={{ width: "100%" }}>
          <img
            src={photo.url}
            alt={`Photo ${index}`}
            style={{ width: "100%", height: "auto" }} // Ajusta a imagem ao tamanho do Paper
          />
        </Paper>
      ))}
    </Carousel>
  );
};

export default PhotoCarousel;
