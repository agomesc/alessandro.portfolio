import React, { useState } from "react";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGalleryApp";
import { Typography, Button, Box } from "@mui/material";

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

  const body = <PhotoGallery id={getID} />;

  return (
    <div className="container-mansory">
      {data.map((item, index) => (
        <div className="image-container" onClick={() => handleOpen(item.id)}>
          <img
            srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
            src={`${item.img}?w=162&auto=format`}
            alt={item.title}
            loading="lazy"
            className="thumbAlbum"
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
          {body}
        </Box>
      </Modal>
    </div>
  );
};

export default ImageMasonry;
