import React, { lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import LazyImage from "../Components/LazyImage";
import LoadingMessage from '../Components/LoadingMessage';
import Typography from "@mui/material/Typography";
import { NavLink } from 'react-router-dom';

const StarComponent = lazy(() => import('../Components/StarComponent'));

const ImageMasonry = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
        Nenhuma imagem disponível
      </Typography>
    );
  }

  return (
    <Masonry columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} spacing={2}>
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{ position: "relative" }}
        >
          <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none' }}>
            <LazyImage src={item.img} alt={item.title} />
          </NavLink>

          {/* Estrela sobreposta */}
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
  );
};

export default React.memo(ImageMasonry);