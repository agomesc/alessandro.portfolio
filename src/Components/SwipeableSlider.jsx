import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import TypographyTitle from './TypographyTitle';

const App = ({ itemData }) => {
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
        alignContent: "center",
        alignItems: "center",
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
        {itemData.map((photo, index) => {
          const isHighlighted = index < 3; // Define destaque para os 3 primeiros

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
              <img
                src={photo.url}
                alt={`Imagem ${index + 1}`}
                style={{
                  width: isHighlighted ? "150px" : "120px",
                  height: isHighlighted ? "100px" : "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: isHighlighted ? "3px solid #1976d2" : "none",
                  boxShadow: isHighlighted ? "0px 0px 10px rgba(0, 0, 0, 0.5)" : "none",
                  transition: "all 0.3s ease-in-out",
                  display: 'block',
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ textAlign: 'right', mt: 4, mb: 4 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/latestphotos')}
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
