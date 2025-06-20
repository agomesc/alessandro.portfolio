import React, { useState, lazy, Suspense } from "react";
import { Typography, IconButton, Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import Slideshow from '@mui/icons-material/Slideshow';
import { NavLink } from "react-router-dom";
import LoadingMessage from "./LoadingMessage";
import LazyImage from "../Components/LazyImage";

const PhotoModal = lazy(() => import("./PhotoModal"));
const StarComponent = lazy(() => import("../Components/StarComponent"));

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl:4 }} spacing={2}>
            {photos.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px"
                }}
              >
                {/* Botão flutuante de slideshow */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "#c0810d",
                    color: "white",
                    zIndex: 2,
                    "&:hover": { bgcolor: "#b0720a" }
                  }}
                  aria-label="Abrir Modal"
                  onClick={() => openModal(index)}
                >
                  <Slideshow />
                </IconButton>

                {/* Link para detalhes da imagem */}
                <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                  <LazyImage
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </NavLink>

                {/* Título e estrela sobrepostos */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    bgcolor: "rgba(0,0,0,0.4)",
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px"
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div" 
                    sx={{
                      color: "white",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                      fontWeight: "bold",
                      maxWidth: "70%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Suspense fallback={<LoadingMessage />}>
                    <StarComponent id={item.id} />
                  </Suspense>
                </Box>
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
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
