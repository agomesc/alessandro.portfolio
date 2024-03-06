// src/components/PhotoGallery.js
import React from "react";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Typography from '@mui/material/Typography';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));
const PhotoGallery = ({ photos }) => {
  return (
    <Box sx={{ width: "100%", minHeight: "800px" }}>
      <Typography variant="h4">Minhas Fotos da Galeria</Typography>  
    <Masonry columns={{ xs: 1, sm: 2, md: 3, lg:4 }} spacing={2}>
      {photos.map((item, index) => (
        <div key={index}>
          <Label>{item.title}</Label>
          <img
            srcSet={`${item.url}?w=162&auto=format&dpr=2 2x`}
            src={`${item.url}?w=162&auto=format`}
            alt={item.title}
            loading="lazy"
            style={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              display: 'block',
              width: '100%',
            }}
          />
        </div>
      ))}
    </Masonry>
  </Box>
  );
};

export default PhotoGallery;
