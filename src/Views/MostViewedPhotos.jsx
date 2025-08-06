import React, { useEffect, useState, useRef } from 'react';
import CreateFlickrApp from "../shared/CreateFlickrApp";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  Box
} from '@mui/material';

const ContentContainer = React.lazy(() => import('../Components/ContentContainer'));
const TypographyTitle = React.lazy(() => import('../Components/TypographyTitle'));

const MostViewedGallery = ({ userID }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const result = await flickrInstance.current.getMostViewedPhotos(userID);
        setPhotos(result);
      } catch (error) {
        console.error('Erro ao carregar fotos mais vistas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [userID]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ContentContainer sx={{ mt: 20 }}>
      <TypographyTitle src="Fotos mais vistas" gutterBottom />
      <ImageList variant="masonry" cols={4} gap={12}>
        {photos.map(photo => (
          <ImageListItem key={photo.id} sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={photo.url}
              alt={photo.title}
              loading="lazy"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
            <ImageListItemBar
              title={photo.title || 'Sem título'}
              subtitle={`👁️ ${photo.views} views`}
              position="top"
              sx={{
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#fff',
                padding: '8px',
                borderRadius: '0 0 8px 8px',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </ContentContainer>
  );
};

export default MostViewedGallery;