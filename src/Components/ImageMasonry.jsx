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
  width: "100%",
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
  display: "inline-block",
  boxShadow: 0,
  border: 0,
  overflow: "hidden",
}));

const CardContainer = styled(Box)(({ isPortrait }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  padding: "16px",
  borderRadius: "5px",
  backgroundColor: "#fff",
  marginBottom: "16px",
  border: "0px solid #000",
  boxShadow: isPortrait
    ? "0px 4px 10px rgba(0, 0, 0, 0.3)" // Sombra mais pronunciada no modo retrato
    : "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra padrão para paisagem
}));


const Thumbnail = styled("img")(() => ({
  width: 80,
  height: 80,
  borderRadius: "5px",
  objectFit: "fit",
}));

const TextContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  textAlign: "left",
  verticalAlign: "middle",
  color: "black",
}));

// Função auxiliar para remover tags HTML e limitar o texto a 100 caracteres
const sanitizeDescription = (description) => {
  const div = document.createElement("div");
  div.innerHTML = description;
  const text = div.textContent || div.innerText || "";
  return text.length > 100 ? text.substring(0, 100) + "..." : text;
};

const ImageMasonry = ({ data }) => {
  const isPortrait = useMediaQuery("(orientation: portrait)");

  return (
    <>
      {isPortrait ? (
        <>
          {data.map((item, index) => (
            <NavLink key={index} to={`/Photos/${item.id}`}>
              <CardContainer isPortrait={isPortrait}>
                <Thumbnail src={item.img} alt={item.title} />
                <TextContainer>
                  <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>{item.title}</Typography>
                  <Typography variant="subtitle2">{sanitizeDescription(item.description)}</Typography>
                </TextContainer>
              </CardContainer>
            </NavLink>
          ))}
        </>
      ) : (
        <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={1}>
          {data.map((item, index) => (
            <GalleryContainer key={index}>
              <NavLink key={index} to={`/Photos/${item.id}`}>
                <LabelTop>
                  {sanitizeDescription(item.title)}
                </LabelTop>
                <ImageComponent src={item.img} alt={item.title} />
              </NavLink>
            </GalleryContainer>
          ))}
        </Masonry>
      )}
    </>
  );
};

export default React.memo(ImageMasonry);
