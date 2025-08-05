import React, { useEffect, useState, Suspense, lazy } from 'react';
import CreateFlickrApp from '../shared/CreateFlickrApp';
import {
    Typography,
    CircularProgress,
    Box,
    Divider,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const GroupedFlickrPhotos = () => {
    const flickr = CreateFlickrApp();
    const [photosByYear, setPhotosByYear] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const grouped = await flickr.getPhotosGroupedByYear();
                setPhotosByYear(grouped);
            } catch (error) {
                console.error('Erro ao carregar fotos agrupadas por ano:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPhotos();
    }, [flickr]);

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
        <>
            <Box
                sx={(theme) => ({
                    p: 0,
                    width: {
                        xs: "100%",
                        sm: "90%",
                        md: "80%",
                        lg: "70%",
                        xl: "80%",
                    },
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    padding: theme.customSpacing.pagePadding,
                    mt: theme.customSpacing.sectionMarginTop,
                })}
            >
                <Suspense fallback={<CustomSkeleton />}>
                    <TypographyTitle src="Linha do Tempo" />
                </Suspense>

                {photosByYear.map(({ year, photos }) => (
                    <Box key={year} mb={8}>
                        <Box mb={2}>
                            <TypographyTitle src={year} />
                        </Box>

                        <Suspense fallback={<CustomSkeleton />}>
                            <Masonry
                                columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                                spacing={2}
                            >
                                {photos.map(photo => (
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
                                ))}
                            </Masonry>
                        </Suspense>
                    </Box>

                ))}
            </Box>
        </>

    );
};

export default GroupedFlickrPhotos;
