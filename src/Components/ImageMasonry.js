import React, { useState } from "react";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGallery";
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
    <div className="container-mansory image-container ">
      {data.map((item, index) => (
        <Button onClick={() => handleOpen(item.id)}>
          <img
            srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
            src={`${item.img}?w=162&auto=format`}
            alt={item.title}
            loading="lazy"
            className="image-container"
          />
          <Typography
            maxWidth="xm"
            variant="h2"
            style={{
              position: "absolute",
              top: 0,
              left: 4,
              background: "rgba(255, 255, 255, 0.8)",
              padding: "3px",
              borderRadius: "2px",
              maxWidth: "100%",
              height: "auto",
            }}
          >
            {item.title}
          </Typography>
        </Button>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "auto",
            bgcolor: "background.paper",
            boxShadow: 0,
            display: "flex-box",
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
