import React, { lazy } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ImageComponent = lazy(() => import("./ImageComponent"));

const PhotoDescription = ({ imageUrl, description }) => {

  const autor = 'Alessandro Gomes';

  return (
    <>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ImageComponent src={imageUrl} alt={autor} />
      </Box>
      <Typography variant="body1" component="div" sx={{ mt: 2, textAlign: "left" }}>
        {description}
      </Typography>

    </>
  );
};

export default PhotoDescription;
