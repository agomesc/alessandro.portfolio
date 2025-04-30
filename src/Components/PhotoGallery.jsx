import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent, Typography, IconButton, Skeleton } from "@mui/material";
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
            <Card key={item.id} sx={{ borderRadius: 0, boxShadow: 3, position: "relative" }}>
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
                <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
                  <ImageComponent
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5
                    }}
                  />
                </Suspense>
              </NavLink>

              <CardContent>
                <Typography component="div" variant="caption" sx={{ padding: 1, m: 0 }}>
                  {item.title}
                </Typography>
                <Suspense fallback={<Skeleton variant="text" width={100} sx={{ padding: 1 }} />}>
                  <StarComponent id={item.id} sx={{ padding: 1, m: 0 }} />
                </Suspense>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      )}

      {showModal && (
        <Suspense fallback={null}>
          <PhotoModal
            photos={photos}
            initialIndex={selectedPhotoIndex}
            onClose={() => setShowModal(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default React.memo(PhotoGallery);
