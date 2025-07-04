import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Make sure this path is correct
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const App = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const imagesCollectionRef = collection(db, 'images');
    const q = query(imagesCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imageList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching images for gallery:", err);
      setError("Failed to load images. Please try again later.");
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Carregando galeria...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6">Nenhuma imagem para exibir na galeria ainda.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" },
        margin: "0 auto",
        px: 2,
        mt: 10,
        pb: 5
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#78884c', mb: 4 }}>
        Nossa Galeria de Fotos
      </Typography>

      <ImageList variant="masonry" cols={{ xs: 1, sm: 2, md: 3 }} gap={16}>
        {images.map((item) => (
          <ImageListItem key={item.id} sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            {/* Overlay div to block right-clicks and pointer events */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10, // Ensure it's on top of the image
                pointerEvents: 'none', // Allow clicks to pass through to the underlying ImageListItem if needed for future functionality
                // To completely disable right-click *on the image area*:
                // onContextMenu: (e) => e.preventDefault(),
                // However, putting it on the img tag is usually better for specific image protection.
              }}
              // This onContextMenu handler needs to be on the img element itself
              // or on a div wrapping *only* the img to be most effective.
              // We'll put it directly on the img below.
            />
            <img
              srcSet={`${item.imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.imageUrl}?w=248&fit=crop&auto=format`}
              alt={item.caption || 'Gallery Image'}
              loading="lazy"
              // Disable right-click on the image
              onContextMenu={(e) => e.preventDefault()}
              // Prevent dragging the image
              draggable="false"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
                display: 'block',
                // Disable pointer events on the image itself
                pointerEvents: 'none'
              }}
            />
            <ImageListItemBar
              title={item.caption || item.title}
              subtitle={item.timestamp ? new Date(item.timestamp.toDate()).toLocaleDateString() : ''}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.caption || 'image'}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default React.memo(App);