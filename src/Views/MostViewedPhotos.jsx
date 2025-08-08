import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import CreateFlickrApp from "../shared/CreateFlickrApp";
import {
  Box,
  CircularProgress,
  Pagination,
} from '@mui/material';

const ContentContainer = lazy(() => import('../Components/ContentContainer'));
const TypographyTitle = lazy(() => import('../Components/TypographyTitle'));
const PhotoGrid = lazy(() => import('../Components/PhotoGrid')); // ajuste o caminho se necessário
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const MostViewedGallery = ({ userID }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const photosPerPage = 20;
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedPhotos = photos.slice(
    (page - 1) * photosPerPage,
    page * photosPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ContentContainer sx={{ mt: 20 }}>
      <Suspense fallback={<CustomSkeleton variant="text" width="100" height="20" />}>
        <TypographyTitle src="Fotos mais vistas" gutterBottom />
      </Suspense>
      <Suspense fallback={<CustomSkeleton width="600" height="300" />}>
        <PhotoGrid itemData={paginatedPhotos} />
      </Suspense>
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
