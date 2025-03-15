import React, { useState, lazy } from "react";
import { Card, CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { yellow } from "@mui/material/colors";
import Slideshow from '@mui/icons-material/Slideshow';
import { NavLink } from "react-router-dom";

const PhotoModal = lazy(() => import("./PhotoModal"));
const StarComponent = lazy(() => import("../Components/StarComponent"));

const PhotoGallery = ({ photos = [] }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {!showModal && (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={1}>
          {photos.map((item) => (

            <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 3, position: "relative" }}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: yellow[700],
                  zIndex: 2
                }}
                aria-label="info"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                <Slideshow />
              </IconButton>
              <NavLink key={item.id} to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                <CardMedia
                  component="img"
                  height="auto"
                  image={item.url}
                  alt={item.title}
                  loading="lazy"
                />
              </NavLink>
              <CardContent>
                <Typography key={item.id} component="div" variant="subtitle1">{item.title}</Typography>
                <StarComponent id={item.id} />
              </CardContent>
            </Card>

          ))}
        </Masonry>
      )}

      {showModal && <PhotoModal photos={photos} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default React.memo(PhotoGallery);
