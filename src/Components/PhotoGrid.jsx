import React from "react";
import { ImageList, ImageListItem } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const PhotoGrid = ({ itemData }) => {
  function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

  return (
    <Box
      sx={{
        p: 0,
        width: "80%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Atualizações
      </Typography>
      <ImageList
        sx={{ width: "100%", height: "auto"  }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        variant="quilted"
        cols={4}
        rowHeight={100}
      >
        {itemData.map((item) => (
          <ImageListItem
            key={item.id}
            cols={item.cols || 1}
            rows={item.rows || 1}
          >
            <img
              {...srcset(item.url, 100, item.rows, item.cols)}
              alt={item.title}
              loading="lazy"
              media="photo"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default PhotoGrid;
