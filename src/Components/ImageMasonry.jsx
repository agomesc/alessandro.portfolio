import React, { lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import LazyImage from "../Components/LazyImage";
import LoadingMessage from '../Components/LoadingMessage';
import Typography from "@mui/material/Typography";
import { NavLink } from 'react-router-dom';

const StarComponent = lazy(() => import('../Components/StarComponent'));

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      ease: "easeOut",
    },
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
    }
  },
};

const ImageMasonry = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
        Nenhuma imagem disponível
      </Typography>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4}} spacing={2}>
        {data.map((item, index) => (
          <motion.div
            key={index}
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
            <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <LazyImage
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: '100%',
                    display: 'block',
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                  }}
                />
              </motion.div>
            </NavLink>

            {/* Title with fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  zIndex: 2,
                  // Added background for better readability on various images
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                }}
              >
                <Typography variant="subtitle1"
                  sx={{
                    color: '#333',
                    fontWeight: 'bold',
                    // Optional: text shadow for better contrast
                    textShadow: '0 0 5px rgba(255,255,255,0.7)'
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </motion.div>

            {/* Star with fade-in */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 2,
                }}
              >
                <Suspense fallback={<LoadingMessage />}>
                  <StarComponent id={item.id} />
                </Suspense>
              </Box>
            </motion.div>
          </motion.div>
        ))}
      </Masonry>
    </motion.div>
  );
};

export default React.memo(ImageMasonry);