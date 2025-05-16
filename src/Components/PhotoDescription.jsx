import React, { lazy, Suspense } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from '@mui/material/Skeleton';

const LazyImage = lazy(() => import("./LazyImage"));

const PhotoDescription = ({ imageUrl, description }) => {
  const autor = "OlhoFotográfico";

  return (
    <>
      {imageUrl && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          
            <LazyImage
              src={imageUrl}
              alt={autor}
            />
        </Box>
      )}
      <Suspense fallback={<Skeleton variant="circular" height={100} />}>
      <Typography variant="body1" component="div" sx={{ mt: 2, textAlign: "left" }}>
        {description}
      </Typography>
      </Suspense>
    </>
  );
};

export default React.memo(PhotoDescription);
