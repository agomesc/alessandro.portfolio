import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom"; // Don't forget to import this
import TypographyTitle from './TypographyTitle'; // Ensure this path is correct
import LazyImage from './LazyImage'; // Ensure this path is correct

// Renamed from App to SwipeableSlider to better reflect its purpose,
// aligning with your previous component structure.
const App = ({ itemData = [], allUpdatesUrl = '/latestphotos' }) => {
  const navigate = useNavigate();

  // No need to create a new `photos` variable if `itemData` is already descriptive enough.
  // const photos = itemData;

  return (
    <Box
      sx={{
        p: 0,
        width: {
          xs: "100%", // Full width on extra small screens
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%"
        },
        margin: "0 auto", // Center the box horizontally
        padding: "0 20px", // Horizontal padding
        mt: 10 // Top margin
      }}
    >
      {/* Title for the section, using a reusable component */}
      <TypographyTitle src="Atualizações" />

      <Box
        sx={{
          display: "flex",
          overflowX: "auto", // Enable horizontal scrolling
          gap: 2, // Space between items
          // Custom scrollbar styling for Webkit browsers (Chrome, Safari, Edge)
          "&::-webkit-scrollbar": {
            height: "6px", // Height of the horizontal scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888", // Color of the scrollbar thumb
            borderRadius: "6px", // Rounded corners for the thumb
          },
          // Firefox scrollbar styling
          scrollbarWidth: "thin", // "auto" or "thin"
          scrollbarColor: "#888 transparent", // thumb color track color
        }}
      >
        {/* Map through itemData to display each photo */}
        {itemData.map((photo, index) => {
          // Determine if the photo should have the "Nova" label
          const isHighlighted = index < 5;

          return (
            <Box
              key={photo.id || index} // Use a unique ID from photo data if available, otherwise index
              sx={{
                position: 'relative',
                flexShrink: 0, // Prevent items from shrinking
                // Optionally define a fixed width for items here if LazyImage doesn't handle it consistently,
                // or ensure LazyImage manages its own size correctly within the flex container.
                width: 150, // Example fixed width for each photo container
                height: 150, // Example fixed height for each photo container
                overflow: 'hidden', // Hide overflow if image is larger than container
                   margin: "0 auto", // This is the key for horizontal centering
              }}
            >
              {/* "Nova" label for highlighted photos */}
              {isHighlighted && (
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: -5, // Slightly above the image
                    left: '50%',
                    transform: 'translateX(-50%)', // Center horizontally
                    backgroundColor: 'error.main', // Red background from theme
                    color: 'white',
                    px: 1, // Horizontal padding
                    py: 0.5, // Vertical padding
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    zIndex: 1, // Ensure it's above the image
                    whiteSpace: 'nowrap', // Prevent text from wrapping
                  }}
                >
                  Nova
                </Typography>
              )}
              {/* Lazy-loaded image component */}
              <LazyImage
                src={photo.url} // Assuming photo object has a 'url' property
                alt={photo.title || `Imagem ${index + 1}`} // Use photo title or generic alt text
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

      {/* "Ver todas as atualizações" link */}
      <Box sx={{ textAlign: 'right', mt: 4, mb: 4 }}>
        <Link
          component="button" // Render as a button for accessibility
          variant="body1"
          onClick={() => navigate(allUpdatesUrl)} // Navigate to the specified URL
          sx={{
            color: 'primary.main', // Uses primary color from your Material-UI theme
            textDecoration: 'none', // No underline by default
            fontSize: '1.1rem',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline', // Underline on hover
            }
          }}
        >
          Ver todas as atualizações
        </Link>
      </Box>
    </Box>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(App);