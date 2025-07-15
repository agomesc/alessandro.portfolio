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
import LazyImage from "./LazyImage";
import CustomSkeleton from './CustomSkeleton';
import { NavLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const StarComponent = lazy(() => import('./StarComponent'));

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
        <div className="fade-container">
          <Grid container spacing={3} justifyContent="center">
            {filteredData.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <div className="card-anim">
                  <div className="icon-top-right">
                    <Suspense fallback={<CustomSkeleton />}>
                      <StarComponent id={item.id} />
                    </Suspense>
                  </div>

                  <div className="icon-top-left">
                    <PhotoLibraryIcon sx={{ color: 'white', fontSize: 20 }} />
                  </div>

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
                        <div className="slide-up fade-delay-1">
                          <Typography gutterBottom variant="h6" component="div"
                            sx={{
                              fontWeight: 'bold',
                              color: '#333',
                              lineHeight: 1.3,
                            }}
                          >
                            {item.title}
                          </Typography>
                        </div>
                        <div className="slide-up fade-delay-2">
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {item.description || 'Uma bela imagem capturada, perfeita para sua coleção de fotos.'}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </NavLink>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Box>
  );
};

export default React.memo(App);
