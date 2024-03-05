import React, { useState } from "react";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGalleryApp";
import {Box } from "@mui/material";
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

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
      <Box sx={{ width: "100%", minHeight: "800px" }}>
      <Masonry columns={4} spacing={2}>
        {data.map((item, index) => (
          <div key={index} onClick={() => handleOpen(item.id)}>
            <Label>{item.title}</Label>
            <img
              srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
              src={`${item.img}?w=162&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
                display: 'block',
                width: '100%',
                height: "auto"
              }}
            />
          </div>
        ))}
      </Masonry>
    </Box>
      <Modal
        sx={{width:"100%"}}
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
            bgcolor: "background.paper",
            boxShadow: 20,
            display: "flex",
            width:"80%",
            height:"80%",
            overflow:"scroll",
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
