import React, { useState, lazy, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import LazyImage from "./LazyImage";
import { NavLink } from 'react-router-dom';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const StarComponent = lazy(() => import('./StarComponent'));

const overlayStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.4)',
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 12px',
  boxSizing: 'border-box',
  zIndex: 1,
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
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={2}>
          {filteredData.map(({ id, title, img }) => (
            <Box
              key={id}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              <NavLink
                to={`/Photos/${id}`}
                style={{ textDecoration: 'none', display: 'block' }}
                aria-label={`Detalhes da foto: ${title}`}
              >
                <LazyImage
                  dataSrc={img}
                  alt={title}
                  style={{
                    width: '100%',
                    display: 'block',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </NavLink>

              {/* Ícone Biblioteca */}
              <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
                <PhotoLibraryIcon sx={{ color: 'white', fontSize: 20, textShadow: '1px 1px 3px black' }} />
              </Box>

              {/* Overlay com título e estrela */}
              <Box sx={overlayStyle}>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: 'white',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
                <Box sx={{ ml: 1 }}>
                  <StarComponent id={id} />
                </Box>
              </Box>
            </Box>
          ))}
        </Masonry>
      )}
    </Box>
  );
};

export default React.memo(App);
