import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import TypographyTitle from './TypographyTitle';
import LazyImage from './LazyImage';

const App = ({ itemData = [], allUpdatesUrl = '/latestphotos' }) => {
  const navigate = useNavigate();

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
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "6px" },
          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent",
        }}
      >
        {/* Now it's safe to map over itemData because we've checked it */}
        {itemData.map((photo, index) => {
          const isHighlighted = index < 5;

          return (
            <Box
              key={photo.id || index}
              sx={{
                position: 'relative',
                flexShrink: 0,
                width: 150,
                height: 150,
                overflow: 'hidden',
                margin: "0 auto",
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out',
                
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
                dataSrc={photo.url}
                alt={photo.title || `Imagem ${index + 1}`}
                width={150}
                height={150}
                sx={{
                  width: '100%',
                  display: 'block',
                  borderRadius: '16px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out'
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'left', mt: 4, mb: 4 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(allUpdatesUrl)}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Ver todas as atualizações
        </Link>
      </Box>
    </Box>
  );
};

export default React.memo(App);