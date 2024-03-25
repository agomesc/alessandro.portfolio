// PhotoModal.js
import React from "react";
import { IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCarousel from "./PhotoCarousel"; // Importe o componente PhotoCarousel

const PhotoModal = ({ photos, onClose }) => {
  return (
    <Box>
      <IconButton sx={{ mb: 3, mt: 0 }}  onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <PhotoCarousel photos={photos} onClose={onClose} />
    </Box>
  );
};

export default PhotoModal;
