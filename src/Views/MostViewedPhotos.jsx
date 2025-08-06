import React, { useEffect, useState, useRef } from 'react';
import CreateFlickrApp from "../shared/CreateFlickrApp";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  Box,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ContentContainer = React.lazy(() => import('../Components/ContentContainer'));
const TypographyTitle = React.lazy(() => import('../Components/TypographyTitle'));

const MostViewedGallery = ({ userID }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const photosPerPage = 20;
  const flickrInstance = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const paginatedPhotos = photos.slice(
    (page - 1) * photosPerPage,
    page * photosPerPage
  );

  const getColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  };

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
      <ImageList variant="masonry" cols={getColumns()} gap={12}>
        {paginatedPhotos.map(photo => (
          <ImageListItem key={photo.id} sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={photo.url}
              alt={photo.title}
              loading="lazy"
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
            <ImageListItemBar
              title={photo.title || 'Sem título'}
              subtitle={`📅 ${formatDate(photo.date)} — 👁️ ${photo.views} views`}
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

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(photos.length / photosPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </ContentContainer>
  );
};

export default MostViewedGallery;