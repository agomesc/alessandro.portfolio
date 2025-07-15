import React, { lazy, Suspense } from "react";
import { Typography, Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import LoadingMessage from "./LoadingMessage"; // Assuming this is a simple loading indicator
import LazyImage from "../Components/LazyImage"; // Assuming this handles lazy loading for images

const StarComponent = lazy(() => import("../Components/StarComponent")); // Lazy load for performance

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const PhotoGallery = ({ photos = [] }) => {
  if (photos.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
        Nenhuma imagem disponível para exibir.
      </Typography>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* NOVO: Adicionando uma Box para centralizar o Masonry */}
      <Box
        sx={{
          display: 'flex',          // Habilita Flexbox
          justifyContent: 'center', // Centraliza o conteúdo horizontalmente
          // Se o Masonry não ocupar 100% da largura do container pai, ele será centralizado.
          // Isso é especialmente útil em telas grandes onde Masonry pode ser menor que a largura total.
          padding: { xs: 1, sm: 2, md: 3 }, // Adiciona preenchimento responsivo ao redor da galeria
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={2}>
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
                cursor: "pointer",
              }}
            >
              {/* Link para detalhes da imagem */}
              <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                <LazyImage
                  dataSrc={item.url}
                  alt={item.title}
                  style={{
                    width: "100%",
                    display: "block",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </NavLink>

              {/* Título e estrela sobrepostos com animação de fade-in */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderBottomLeftRadius: "12px",
                  borderBottomRightRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between", // Distributes space between title and star
                  alignItems: "center",
                  padding: "8px 12px",
                  boxSizing: "border-box",
                  zIndex: 1,
                }}
              >
                {/* Box for the title to control its space and overflow */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: "white",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>

                {/* Box for the StarComponent to control its spacing */}
                <Box sx={{ ml: 1 }}>
                  <Suspense fallback={<LoadingMessage />}>
                    <StarComponent id={item.id} />
                  </Suspense>
                </Box>
              </motion.div>
            </motion.div>
          ))}
        </Masonry>
      </Box>
    </motion.div>
  );
};

export default React.memo(PhotoGallery);