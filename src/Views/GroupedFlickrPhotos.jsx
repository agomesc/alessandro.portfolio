import React, { useEffect, useState, lazy, Suspense, useRef } from 'react';
import CreateFlickrApp from '../shared/CreateFlickrApp';
import {
  Typography,
  CircularProgress,
  Box,
  Pagination,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import("../Components/ContentContainer"));

const GroupedFlickrPhotos = () => {
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  const [photosByYear, setPhotosByYear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagesByYear, setPagesByYear] = useState({});
  const photosPerPage = 20;

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const grouped = await flickrInstance.current.getPhotosGroupedByYear();
        setPhotosByYear(grouped);

        const initialPages = {};
        grouped.forEach(({ year }) => {
          initialPages[year] = 1;
        });
        setPagesByYear(initialPages);
      } catch (error) {
        console.error('Erro ao carregar fotos agrupadas por ano:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const handlePageChange = (year, value) => {
    setPagesByYear(prev => ({
      ...prev,
      [year]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (photosByYear.length === 0) {
    return <Typography align="center">Nenhuma foto encontrada.</Typography>;
  }

  return (
    <ContentContainer sx={{ mt: 20 }}>
      <TypographyTitle src="Linha do Tempo" />

      {photosByYear.map(({ year, photos }) => {
        const currentPage = pagesByYear[year] || 1;
        const totalPages = Math.ceil(photos.length / photosPerPage);
        const paginatedPhotos = photos.slice(
          (currentPage - 1) * photosPerPage,
          currentPage * photosPerPage
        );

        return (
          <Box key={year} mb={8}>
            <Box mb={2}>
              <Suspense fallback={<CustomSkeleton variant="text" width="100" height="20" />}>
                <TypographyTitle src={year} />
              </Suspense>
            </Box>

            {paginatedPhotos.length > 0 && (
              <Masonry
                columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                spacing={2}
              >
                {paginatedPhotos.map(photo => (

                  <Suspense fallback={<CustomSkeleton width={320} height={240} />}>
                    <Box
                      key={photo.id}
                      component="img"
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      sx={{
                        borderRadius: 2,
                        width: '100%',
                        display: 'block',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                  </Suspense>
                ))}
              </Masonry>
            )}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => handlePageChange(year, value)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        );
      })}
    </ContentContainer>
  );
};

export default GroupedFlickrPhotos;