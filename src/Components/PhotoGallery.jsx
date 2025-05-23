import React, { useState, lazy, Suspense } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Typography from "@mui/material/Typography";
import PhotoModal from "./PhotoModal"; // Importe o componente
import IconButton from "@mui/material/IconButton";
import InfoIcon from '@mui/icons-material/Info';
import { Link } from "react-router-dom";
import LoadingMessage from "./LoadingMessage";

const ImageComponent = lazy(() => import("./ImageComponent"));

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

const StyledImageComponent = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain', // Mantém a proporção das imagens
});

const PhotoGallery = ({ photos }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Suspense fallback={<LoadingMessage />}>
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
          Minhas Fotos
        </Typography>
        {!showModal && (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {photos.map((item, index) => (
              <GalleryContainer
                className="image-container"
                key={index}
                onClick={() => setShowModal(true)}
              >
                <Label style={{ zIndex: 2 }}>{item.title}
                  <nav>
                    <Link to={`/PhotoInfo/${item.id}`}>
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Link>
                  </nav>
                </Label>
                <StyledImageComponent src={item.url} alt={item.title} />
              </GalleryContainer>
            ))}
          </Masonry>
        )}
        {showModal && (
          <PhotoModal photos={photos} onClose={() => setShowModal(false)} />
        )}
      </Box>
    </Suspense>
  );
};

export default React.memo(PhotoGallery);
