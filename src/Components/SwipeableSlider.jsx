import React from 'react';
import Box from "@mui/material/Box";
import TypographyTitle from './TypographyTitle';
import PhotoCarousel from './PhotoCarousel'; // já deve estar implementado
import { useSwipeable } from 'react-swipeable';

const SwipeableSlider = ({ itemData }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swiped Left'),
    onSwipedRight: () => console.log('Swiped Right'),
  });

  return (
    <Box
      {...handlers}
      sx={{
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%",
        },
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      <TypographyTitle src="Atualizações" />
      <PhotoCarousel photos={itemData} />
    </Box>
  );
};

export default React.memo(SwipeableSlider);
