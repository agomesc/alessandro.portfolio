import React, { useState } from "react";
import Masonry from "@mui/lab/Masonry";
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
    <Box>
      <Masonry columns={3} spacing={2}>
        {data.map((item, index) => (
          <div key={index}>
            <Button onClick={() => handleOpen(item.id)}>
              <img
                srcSet={`${item.img}?w=100vw&auto=format&dpr=2 2x`}
                src={`${item.img}?w=auto&auto=format`}
                alt={item.title}
                loading="lazy"
                style={{
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  display: "block",
                  width: "100%",
                }}
              />
            </Button>
            <Typography>{item.title}</Typography>
          </div>
        ))}
      </Masonry>
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
            width: "80vw",
            height: "89vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {body}
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageMasonry;
