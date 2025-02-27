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
}));

const CardContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  marginBottom: "16px",
  border: "1px solid #000",  // Adiciona uma borda
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",  // Adiciona uma sombra simples
}));

const Thumbnail = styled("img")(() => ({
  width: 80,
  height: 80,
  borderRadius: "5px",
  objectFit: "cover",
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
              <CardContainer>
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
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {data.map((item, index) => (
            <GalleryContainer key={index}>
              <NavLink key={index} to={`/Photos/${item.id}`}>
                <LabelTop>{item.title}</LabelTop>
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
