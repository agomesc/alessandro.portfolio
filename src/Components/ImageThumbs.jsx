import React, { useState, lazy, Suspense, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import LazyImage from "./LazyImage";
import CustomSkeleton from './CustomSkeleton';
import { NavLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const StarComponent = lazy(() => import('./StarComponent'));

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
    }
  },
};

const App = ({ data = [] }) => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        
        <TextField
          variant="outlined"
          size="small"
          label="Buscar por título"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />
      </Box>

      {filteredData.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Nenhuma imagem encontrada
        </Typography>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <Grid container spacing={3} justifyContent="center">
            {filteredData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#fff",
                    willChange: 'transform',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    >
                      <Suspense fallback={<CustomSkeleton />}>
                        <StarComponent id={item.id} />
                      </Suspense>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 2,
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '50%',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <PhotoLibraryIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </motion.div>

                  <NavLink to={`/Photos/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <CardMedia
                        component={() => (
                          <LazyImage
                            dataSrc={item.img}
                            alt={item.title}
                            width="100%"
                            height="200px"
                            fallbackColor="#f0f0f0"
                            aspectRatio="16 / 9"
                            style={{
                              objectFit: 'cover',
                              borderTopLeftRadius: '16px',
                              borderTopRightRadius: '16px',
                              display: 'block',
                            }}
                          />
                        )}
                      />
                      <CardContent sx={{ flexGrow: 1, paddingBottom: '16px !important', maxHeight: '400px' }}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                        >
                          <Typography gutterBottom variant="h6" component="div"
                            sx={{
                              fontWeight: 'bold',
                              color: '#333',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </Typography>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                        >
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.description || 'Uma bela imagem capturada, perfeita para sua coleção de fotos.'}
                          </Typography>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </NavLink>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Box>
  );
};

export default React.memo(App);
