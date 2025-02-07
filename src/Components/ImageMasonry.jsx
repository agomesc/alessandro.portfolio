import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Masonry } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import React from 'react';

const LabelTop = styled(Paper)(() => ({
  position: "absolute",
  content: '""',
  top: 0,
  left: 0,
  width: "auto",
  height: "10%",
  backgroundColor: "rgba(2, 2, 2, 0.75)",
  color: "#fff",
  textAlign: "center",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  borderRadius: 0,
  textTransform: "uppercase",
  fontSize: 12
}));

const GalleryContainer = styled(Paper)(() => ({
  position: "relative",
}));

const ImageComponent = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain', // Mantém a proporção das imagens
});

const ImageMasonry = ({ data }) => {
  return (
    <Box
      sx={{
        p: 0,
        width: "80%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {data.map((item, index) => (
          <GalleryContainer className="image-container" key={index}>
            <NavLink key={index} to={`/Photos/${item.id}`}>
              <LabelTop>{item.title}</LabelTop>
              <ImageComponent src={item.img} alt={item.title} />
            </NavLink>
          </GalleryContainer>
        ))}
      </Masonry>
    </Box>
  );
};

export default React.memo(ImageMasonry);
