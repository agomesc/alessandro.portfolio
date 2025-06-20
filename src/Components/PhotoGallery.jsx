import React, { lazy, Suspense } from "react";
import { Typography, Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import LoadingMessage from "./LoadingMessage";
import LazyImage from "../Components/LazyImage";

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
  // If there are no photos, display a message.
  if (photos.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 4 }}>
        Nenhuma imagem disponível para exibir.
      </Typography>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }} spacing={2}>
        {photos.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              cursor: "pointer", // Ensure cursor indicates it's clickable
            }}
          >
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

            {/* Título e estrela sobrepostos com animação de fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} // Start slightly below and invisible
              animate={{ opacity: 1, y: 0 }} // Animate to visible and original position
              transition={{ delay: 0.3, duration: 0.4 }} // Delay to appear after image, smooth duration
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                // Apply the background and border radius here to match the image
                backgroundColor: "rgba(0,0,0,0.4)",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px", // Adjust padding for better look
                boxSizing: "border-box", // Ensure padding is included in width
                zIndex: 1, // Ensure it's above the image
              }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{
                  color: "white",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                  fontWeight: "bold",
                  maxWidth: "calc(100% - 40px)", // Allocate space for the star
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.title}
              </Typography>
              <Suspense fallback={<LoadingMessage />}>
                <StarComponent id={item.id} />
              </Suspense>
            </motion.div>
          </motion.div>
        ))}
      </Masonry>
    </motion.div>
  );
};

export default React.memo(PhotoGallery);