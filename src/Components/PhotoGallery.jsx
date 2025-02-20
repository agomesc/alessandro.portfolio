import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import PhotoModal from "./PhotoModal"; // Importe o componente
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import { Link } from "react-router-dom";
import ImageComponent from './ImageComponent';
import { yellow } from '@mui/material/colors';

const Label = styled(Paper)(() => ({
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

const PhotoGallery = ({ photos }) => {
  const [showModal, setShowModal] = useState(false);

  return (

    <>
      {!showModal && (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {photos.map((item, index) => (
            <GalleryContainer
              key={index}
              onClick={() => setShowModal(true)}
            >
              <Label style={{ zIndex: 3 }}>{item.title}
                
                  <Link to={`/PhotoInfo/${item.id}`}>
                    <IconButton>
                      <InfoIcon sx={{ bgcolor: yellow[700] }} aria-label="recipe" />
                    </IconButton>
                  </Link>
                
              </Label>
              <ImageComponent src={item.url} alt={item.title} />
            </GalleryContainer>
          ))}
        </Masonry>
      )}
      {showModal && (
        <PhotoModal photos={photos} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default React.memo(PhotoGallery);
