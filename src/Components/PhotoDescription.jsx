import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LazyImage from "./LazyImage";

const PhotoDescription = ({ imageUrl, description }) => {
  const autor = "OlhoFotográfico";

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LazyImage
          dataSrc="/eu.jpg"
          width={267}
          height={400}
          style={{ margin: "0 auto" }}
        />
      </Box>
      <Typography
        variant="body1"
        component="div"
        sx={{ mt: 2, textAlign: "left" }}
      >
        {description}
      </Typography>
      {imageUrl && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <LazyImage
            dataSrc={imageUrl}
            alt={autor}
            width={192}
            height="auto"
          />
        </Box>
      )}

    </>
  );
};

export default React.memo(PhotoDescription);