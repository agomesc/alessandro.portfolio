import React, { lazy, Suspense } from 'react';
import { Box, Typography } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import { NavLink } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import { motion } from 'framer-motion';
import LazyImage from "../Components/LazyImage";

const StarComponent = lazy(() => import("../Components/StarComponent"));

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, ease: 'easeOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15
    },
  },
};

const PhotoGrid = ({ itemData = [] }) => {
  return (
    <>
      {itemData.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={2}>
            {itemData.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  rotateZ: 0.2,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "16px",
                  background: "#fff",
                  willChange: 'transform',
                  cursor: 'pointer',
                }}
              >
                <NavLink to={`/PhotoInfo/${item.id}`} style={{ textDecoration: "none" }}>
                  <LazyImage
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      display: "block",
                      borderRadius: "16px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                    }}
                  />
                </NavLink>

                {/* Título sobreposto */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.9rem',
                      maxWidth: "calc(100% - 80px)",
                    }}
                  >
                    <Typography variant="subtitle2" component="div" noWrap>
                      {item.title}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Estrela sobreposta */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 2,
                    }}
                  >
                    <Suspense fallback={<Skeleton variant="circular" width={24} height={24} />}>
                      <StarComponent id={item.id} />
                    </Suspense>
                  </Box>
                </motion.div>
              </motion.div>
            ))}
          </Masonry>
        </motion.div>
      ) : (
        <Suspense fallback={<Skeleton variant="text" />}>
          <Typography component="div" variant="caption" align="center" sx={{ mt: 4 }}>
            Nenhuma imagem disponível
          </Typography>
        </Suspense>
      )}
    </>
  );
};

export default React.memo(PhotoGrid);
