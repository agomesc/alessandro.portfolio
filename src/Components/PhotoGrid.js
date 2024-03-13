import React from "react";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PhotoGrid = ({ itemData }) => {
  return (
    <Box sx={{ p: 0, width: "80%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Atualizações
      </Typography>
      <ImageList columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} cols={5} rowHeight={220}>
        {itemData.map((item) => (
          <ImageListItem key={item.id}>
            <img style={{ width: "220", height: "100%" }} loading="lazy" src={item.url} alt={item.title} />
            <ImageListItemBar title={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default PhotoGrid;
