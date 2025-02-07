import React from 'react';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Masonry } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import ImageComponent from './ImageComponent';  
import useMediaQuery from "@mui/material/useMediaQuery";

const LabelTop = styled(Paper)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "auto",
  height: "10%",
  backgroundColor: "rgba(2, 2, 2, 0.75)",
  color: "#fff",
  textAlign: "center",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  borderRadius: 0,
  textTransform: "uppercase",
  fontSize: 12,
  zIndex: 2,
}));

const GalleryContainer = styled(Paper)(() => ({
  position: "relative",
  cursor: "pointer",
}));

const CardContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
}));

const Thumbnail = styled("img")(() => ({
  width: 80,
  height: 80,
  borderRadius: "8px",
  objectFit: "cover",
}));

const ImageMasonry = ({ data }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <Box sx={{ p: 0, width: "80%", margin: "0 auto", textAlign: "center" }}>
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      {isPortrait ? (
        <Box>
          {data.map((item, index) => (
            <CardContainer key={index}>
              <Thumbnail src={item.img} alt={item.title} />
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <NavLink to={`/Photos/${item.id}`}>{item.title}</NavLink>
              </Box>
            </CardContainer>
          ))}
        </Box>
      ) : (
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
      )}
    </Box>
  );
};

export default React.memo(ImageMasonry);
