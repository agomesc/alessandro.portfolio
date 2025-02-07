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
  alignItems: "flex-start", // Alinha pelo topo
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  marginBottom: "16px", // Espaçamento entre os cards
}));

const Thumbnail = styled("img")(() => ({
  width: 80,
  height: 80,
  borderRadius: "8px",
  objectFit: "cover",
}));

const TextContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start", // Alinha pelo topo
  textAlign: "left",
  verticalAlign: "middle",
  color: "black", // Garante que a cor seja preta
}));

const ImageMasonry = ({ data }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <Box
      sx={{
        p: 0,
        width: "100%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
        Minhas Galerias
      </Typography>
      {isPortrait ? (
        <Box>
          {data.map((item, index) => (
            <CardContainer key={index}>
              <NavLink to={`/Photos/${item.id}`}>
                <Thumbnail src={item.img} alt={item.title} />
              </NavLink>
              <TextContainer>
                <Typography variant="h6">{item.title}</Typography>

              </TextContainer>
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
