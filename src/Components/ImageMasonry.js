import React, { useState } from "react";
import { Modal } from "@mui/material";
import PhotoGallery from "../PhotoGalleryApp";
import {Box } from "@mui/material";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
    
    <Box sx={{ pt: 4 }}>
     <Typography variant="h4">Minhas Galerias</Typography>  
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
                height: "auto",
                cursor: "pointer"
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
            width:"90%",
            height:"90%",
            overflow:"scroll",
            p: 10,
          }}
        >
           <IconButton
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
          <PhotoGallery id={getID} />
        </Box>
      </Modal>
    </Box>

  );
};

export default ImageMasonry;
