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
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
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
      <Masonry columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {data.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}
          >
            <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none' }}>
              <LazyImage
                src={item.img}
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

            {/* Estrela sobreposta (mantida como estava) */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <Suspense fallback={<LoadingMessage />}>
                <StarComponent id={item.id} />
              </Suspense>
            </Box>
          </motion.div>
        ))}
      </Masonry>
    </motion.div>
  );
};

export default React.memo(ImageMasonry);
