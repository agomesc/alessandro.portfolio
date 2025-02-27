import { React, lazy } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ImageComponent from './ImageComponent'
const TypographyTitle = lazy(() => import("./TypographyTitle"));


const PhotoDescription = ({ imageUrl, description }) => {

  const autor = 'Alessandro Gomes';

  return (
    <Box
      sx={{
        p: 0,
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >

      <TypographyTitle src="Sobre?"></TypographyTitle>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ImageComponent src={imageUrl} alt={autor} />
      </Box>


      <Typography variant="body1" component="div" sx={{ mt: 2, textAlign: "left" }}>
        {description}
      </Typography>

    </Box>
  );
};

export default PhotoDescription;
