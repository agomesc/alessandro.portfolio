import React from 'react';
import Box from "@mui/material/Box";
import TypographyTitle from './TypographyTitle';

const SwipeableSlider = ({ itemData }) => {
  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%"
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "0 20px",
        mt: 10
      }}
    >
      <TypographyTitle src="Atualizações" />
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2, // Espaço entre as imagens
          scrollbarWidth: "thin", // Ajuste da barra de rolagem
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "6px",
          }
        }}
      >
        {itemData.map((photo, index) => (
          <img
            key={index}
            src={photo.url}
            alt={`Imagem ${index + 1}`}
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default React.memo(SwipeableSlider);