import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import PhotoModal from "./PhotoModal"; // Importe o componente
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import { NavLink } from "react-router-dom";
import ImageComponent from './ImageComponent';
import { yellow } from '@mui/material/colors';

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
  border: 10,
  overflow: "hidden",
}));

const PhotoGallery = ({ photos }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {!showModal && (
        <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5 }} spacing={1}>
          {photos.map((item, index) => (
            <GalleryContainer
              key={index}
              onClick={() => setShowModal(true)}
            >
              <NavLink to={`/PhotoInfo/${item.id}`}>
                <LabelTop style={{ zIndex: 1 }}>{item.title}
                  <IconButton>
                    <InfoIcon sx={{ bgcolor: yellow[700] }} aria-label="recipe" />
                  </IconButton>
                </LabelTop>
              </NavLink>
              <ImageComponent src={item.url} alt={item.title} />
            </GalleryContainer>
          ))}
        </Masonry >
      )}
      {
        showModal && (
          <PhotoModal photos={photos} onClose={() => setShowModal(false)} />
        )
      }
    </>
  );
};

export default React.memo(PhotoGallery);
