import React from "react";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCarousel from "./PhotoCarousel";

const PhotoModal = ({ photos, onClose }) => {
  return (
    <Box
      sx={{
        position: "relative",
        p: 2,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: "#fff",
          '&:hover': { backgroundColor: "#eee" },
        }}
      >
        <CloseIcon />
      </IconButton>
      {photos && <PhotoCarousel photos={photos} onClose={onClose} />}
    </Box>
  );
};

export default React.memo(PhotoModal);
