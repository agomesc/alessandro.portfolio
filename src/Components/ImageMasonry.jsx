import React, { lazy, Suspense, useState, useMemo } from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry'; // Corrected import path for Masonry
import { motion } from 'framer-motion';
// Assuming these components are available in your project structure
import LazyImage from "../Components/LazyImage";
// import LoadingMessage from '../Components/LoadingMessage';
import { NavLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SearchIcon from '@mui/icons-material/Search'; // Import search icon

const LoadingMessage = () => <Typography>Loading...</Typography>;
const StarComponent = ({ id }) => <Typography>⭐ {id}</Typography>;


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
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the filtered data to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter(item =>
      item.title.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [data, searchTerm]);

  return (
    <Box sx={{ p: 2 }}> {/* Add some padding around the whole component */}
      {/* Search Input Field */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar as galerias pelo título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: 'background.paper', boxShadow: 3 },
          }}
          sx={{ maxWidth: '600px' }} // Limit width for better aesthetics
        />
      </Box>

      {/* Conditional rendering for no images */}
      {filteredData.length === 0 ? (
        <Typography variant="h4" align="center" component="div" sx={{ mt: 4 }}>
          No images available matching your search.
        </Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }} spacing={2}>
            {filteredData.map((item, index) => (
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
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                    }}
                  >
                    <Typography variant="subtitle1"
                      sx={{
                        color: '#333',
                        fontWeight: 'bold',
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

                {/* Gallery Icon with fade-in */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10, // Position it on the left side
                      zIndex: 2,
                      background: 'rgba(0, 0, 0, 0.5)', // Darker background for contrast
                      borderRadius: '50%', // Make it a circle
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none' }}>
                      <PhotoLibraryIcon sx={{ color: 'white', fontSize: 20 }} /> {/* Icon color and size */}
                    </NavLink>
                  </Box>
                </motion.div>

              </motion.div>
            ))}
          </Masonry>
        </motion.div>
      )}
    </Box>
  );
};

export default React.memo(ImageMasonry);
