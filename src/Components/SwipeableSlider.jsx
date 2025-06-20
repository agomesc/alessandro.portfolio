import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import TypographyTitle from './TypographyTitle';
import LazyImage from './LazyImage';

const App = ({ itemData = [], allUpdatesUrl = '/latestphotos' }) => { // Add allUpdatesUrl as a prop
  const navigate = useNavigate();

  const photos = itemData;

  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%"
        },
        margin: "0 auto",
        padding: "0 20px",
        mt: 10
      }}
    >
      <TypographyTitle src="Atualizações" />

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "6px",
          }
        }}
      >
        {photos.map((photo, index) => {
          const isHighlighted = index < 2; // primeiras duas com etiqueta

          return (
            <Box
              key={index}
              sx={{
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {isHighlighted && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: -5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    zIndex: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Nova
                </Typography>
              )}
              <LazyImage
                src={photo.url}
                alt={`Imagem ${index + 1}`}
                width={150}
                height={150}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'right', mt: 4, mb: 4 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(allUpdatesUrl)} // Use the allUpdatesUrl prop here
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          Ver todas as atualizações
        </Link>
      </Box>
    </Box>
  );
};

export default React.memo(App);