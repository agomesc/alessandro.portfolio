import React, { lazy } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ImageComponent = lazy(() => import("./ImageComponent"));

const PhotoDescription = ({ imageUrl, description }) => {

  const autor = 'OlhoFotográfico';

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {imageUrl && <ImageComponent src={imageUrl} alt={autor} width="240px" height="240px" />}
      </Box>
      <Typography variant="body1" component="div" sx={{ mt: 2, textAlign: "left" }}>
        {description}
      </Typography>
    </>
  );
};

export default PhotoDescription;
