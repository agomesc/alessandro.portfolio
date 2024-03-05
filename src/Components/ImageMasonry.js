import React, { useState } from "react";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGalleryApp";
import { Typography, Box } from "@mui/material";
import "./ImageMansory.css"; // Estilo opcional

const ImageMasonry = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [getID, setID] = useState(false);

  const handleOpen = (id) => {
    setID(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    
    <Box className="container-mansory">
      {data.map((item, index) => (
        <div
          className="image-container"
          onClick={() => handleOpen(item.id)}
          key={index}
        >
          <img
            srcSet={item.img}
            src={item.img}
            alt={item.title}
            loading="lazy"
          />
          <Typography
            variant="h2"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(255, 255, 255, 0.8)",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {item.title}
          </Typography>
        </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "95vh",
            bgcolor: "background.paper",
            boxShadow: 0,
            display: "block",
            p: 0,
          }}
        >
          <PhotoGallery id={getID} />
        </Box>
      </Modal>
    </Box>

  );
};

export default ImageMasonry;
