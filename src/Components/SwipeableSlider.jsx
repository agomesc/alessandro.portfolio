import React from 'react';
import Box from "@mui/material/Box";
import TypographyTitle from './TypographyTitle';
import PhotoCarousel from './PhotoCarousel'; // já deve estar implementado

const SwipeableSlider = ({ itemData }) => {
  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%", // Para telas extra pequenas (mobile)
          sm: "90%",  // Para telas pequenas
          md: "80%",  // Para telas médias
          lg: "70%",  // Para telas grandes
          xl: "80%"   // Para telas extra grandes
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "0 20px",
        mt: 10
      }}
    >
      <TypographyTitle src="Atualizações" />
      <PhotoCarousel photos={itemData} />
    </Box>
  );
};

export default React.memo(SwipeableSlider);
