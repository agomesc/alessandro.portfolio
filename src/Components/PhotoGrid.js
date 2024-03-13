import React from "react";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PhotoGrid = ({itemData}) => {
  return (
    <Box sx={{ mt: 10, p: 0 }}>
    <Typography sx={{ mt: 5, mb: 3 }} variant="h4">
      Atualizações
    </Typography>
    <ImageList cols={3} rowHeight={200}>
      {itemData.map((item) => (
        <ImageListItem key={item.id}>
          <img loading="lazy" src={item.url} alt={item.title} />
          <ImageListItemBar title={item.title} />
        </ImageListItem>
      ))}
    </ImageList>
    </Box>
  );
};

export default PhotoGrid;
