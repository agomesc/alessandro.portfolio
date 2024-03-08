import React, { useState } from "react";
import PhotoGallery from "../PhotoGalleryApp";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";
import MainDrawer from "../Components/MainDrawer";

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const ImageMasonry = ({ data }) => {
  const [getID, setID] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerOpen = (id) => {
    setDrawerOpen(true);
    setID(id);
  };

  return (
    <Box sx={{ pt: 4 }}>
      <Typography sx={{ mt: 3, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {data.map((item, index) => (
          <div key={index} onClick={() => handleDrawerOpen(item.id)}>
            <Label>{item.title}</Label>
            <img
              srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
              src={`${item.img}?w=162&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                display: "block",
                width: "100%",
                height: "auto",
                cursor: "pointer",
              }}
            />
            <Label>{item.description}</Label>
          </div>
        ))}
      </Masonry>

      <MainDrawer open={drawerOpen} handleClose={handleDrawerClose}>
        <PhotoGallery id={getID} />
      </MainDrawer>
    </Box>
  );
};

export default ImageMasonry;
