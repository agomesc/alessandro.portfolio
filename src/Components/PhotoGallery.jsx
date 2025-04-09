import React, { useState, lazy } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import Slideshow from '@mui/icons-material/Slideshow';
import { NavLink } from "react-router-dom";

const PhotoModal = lazy(() => import("./PhotoModal"));
const StarComponent = lazy(() => import("../Components/StarComponent"));
const ImageComponent = lazy(() => import("../Components/ImageComponent"));

const PhotoGallery = ({ photos = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const openModal = (index) => {
    setSelectedPhotoIndex(index);
    setShowModal(true);
  };

  return (
    <>
      {!showModal && (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {photos.map((item, index) => (
            <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#c0810d",
                  zIndex: 2
                }}
                aria-label="Abrir Modal"
                onClick={() => openModal(index)}
              >
                <Slideshow />
              </IconButton>

              <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                <ImageComponent
                  src={item.url}
                  alt={item.title}
                  height="auto"
                  style={{ padding: 8, borderRadius: 20 }}
                />
              </NavLink>

              <CardContent>
                <Typography component="div" variant="caption" sx={{ padding: 1, m: 0 }}>
                  {item.title}
                </Typography>
                <StarComponent id={item.id} sx={{ padding: 1, m: 0 }} />
              </CardContent>
            </Card>
          ))}
        </Masonry>
      )}

      {showModal && (
        <PhotoModal
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default React.memo(PhotoGallery);
