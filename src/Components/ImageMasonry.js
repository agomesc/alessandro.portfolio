import React, { useState } from "react";
import Masonry from "@mui/lab/Masonry";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGallery";
import { Typography, Button, Box, Container } from "@mui/material";

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
    <Container>
      <Masonry columns={4} spacing={0}>
        {data.map((item, index) => (
          <div key={index}>
            <Button onClick={() => handleOpen(item.id)}>
              <Box>
                <img
                  srcSet={`${item.img}?w=100vw&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=auto&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    display: "flex-box",
                    width: "100%",
                  }}
                />
                <Typography
                  maxWidth="xm"
                  variant="subititle"
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
              </Box>
            </Button>
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
            width: "50vw",
            height: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {body}
        </Box>
      </Modal>
    </Container>
  );
};

export default ImageMasonry;
