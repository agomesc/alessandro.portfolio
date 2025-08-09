import React, { useEffect, useState, lazy, Suspense } from 'react';
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

const CommentBox = lazy(() => import("../Components/CommentBox"));
const StarComponent = lazy(() => import("../Components/StarComponent"));
const LazyImage = lazy(() => import("../Components/LazyImage"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ContentContainer = React.lazy(() => import('../Components/ContentContainer'));

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

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography component="div" variant="h6" sx={{ mt: 2 }}>Carregando galeria...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'error.main' }}>
        <Typography component="div" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (images.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography component="div" variant="h6">Nenhuma imagem para exibir na galeria ainda.</Typography>
      </Box>
    );
  }

  return (
    <Suspense fallback={<CustomSkeleton />}>
      <ContentContainer sx={{ mt: 15, mb: 10 }}>

        <TypographyTitle src="Galeria de Fotos" />


        <ImageList variant="masonry" cols={{ xs: 1, sm: 2, md: 3 }} gap={16}>
          {images.map((item) => (
            <ImageListItem
              key={item.id}
              sx={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Avaliação (estrelas) sobre a imagem */}
              <Box
                sx={{
                  position: 'absolute',
                  right: 8,
                  zIndex: 2,
                  borderRadius: '8px',
                  px: 1,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <React.Suspense fallback={<CustomSkeleton />}>
                  <StarComponent id={item.id} />
                </React.Suspense>
              </Box>

              <LazyImage
                dataSrc={`${item.imageUrl}?w=248&fit=crop&auto=format`}
                alt={item.caption || 'Gallery Image'}
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  pointerEvents: 'none'
                }}
              />

              {/* Barra inferior com título e data */}
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
        <CommentBox itemID="FeaturedPhotos" />
      </ContentContainer>
    </Suspense>
  );
};

export default React.memo(App);