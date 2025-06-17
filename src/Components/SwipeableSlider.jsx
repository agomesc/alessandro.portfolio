import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import TypographyTitle from './TypographyTitle'; // Assuming this path is correct
import LazyImage from './LazyImage'; // Assuming this path is correct

const App = ({ itemData = [] }) => { // Added default empty array for itemData
  const navigate = useNavigate();

  // Get the first item for the main highlighted photo
  const mainPhoto = itemData.length > 0 ? itemData[0] : null;
  // Get the rest of the items for the scrollable list, excluding the first one
  const restOfPhotos = itemData.slice(1);

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

      {/* Main Highlighted Photo */}
      {mainPhoto && (
        <Box
          sx={{
            mb: 4, // Margin bottom for spacing
            width: '100%',
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio (9 / 16 * 100)
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', // Stronger shadow for highlight
            border: '4px solid #1976d2', // Prominent border
          }}
        >
          <LazyImage
            src={mainPhoto.url}
            alt="Destaque"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              // Change from 'cover' to 'contain'
              objectFit: 'contain', // This ensures the entire image is visible
            }}
          />
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              p: 1,
              textAlign: 'center',
              fontWeight: 'bold',
              objectFit: 'cover', // This ensures the entire image is visible
            }}
          >
            Última Atualização
          </Typography>
        </Box>
      )}

      {/* Scrollable List of Photos */}
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
        {restOfPhotos.map((photo, index) => {
          // The 'Nova' tag now applies to the first two items in the *restOfPhotos* array
          // which effectively means the 2nd and 3rd overall photos.
          const isHighlighted = index < 2;

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
                alt={`Imagem ${index + 2}`}
                style={{
                  width: isHighlighted ? "150px" : "120px",
                  height: isHighlighted ? "100px" : "80px",
                  // Change from 'cover' to 'contain'
                  objectFit: "contain", // This ensures the entire image is visible
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