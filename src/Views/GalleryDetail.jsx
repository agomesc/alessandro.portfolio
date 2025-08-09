import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Box, Typography, CircularProgress, Alert, Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const StarComponent = React.lazy(() => import("../Components/StarComponent"));
const ContentContainer = React.lazy(() => import('../Components/ContentContainer'));
const ViewComponent = React.lazy(() => import("../Components/ViewComponent"));
const CommentBox = React.lazy(() => import("../Components/CommentBox"));
const LazyImage = React.lazy(() => import("../Components/LazyImage"));
const SocialMetaTags = React.lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = React.lazy(() => import("../Components/CustomSkeleton"));


const getImageSrc = (imageData) => {
    if (!imageData) return '';
    if (imageData.startsWith('data:image')) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
};

const GalleryDetail = () => {
    const { id } = useParams();
    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGalleryDetail = async () => {
            try {
                const docRef = doc(db, 'galleries', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setGallery({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Galeria não encontrada.');
                }
            } catch (err) {
                console.error('Erro ao buscar detalhes da galeria:', err);
                setError('Erro ao carregar os detalhes da galeria.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGalleryDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ mt: 10, px: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!gallery) {
        return (
            <Box sx={{ mt: 10, px: 2 }}>
                <Alert severity="info">Nenhuma galeria selecionada ou encontrada.</Alert>
            </Box>
        );
    }

    return (
        <>
            <ContentContainer sx={{ mt: 15, mb: 10 }}>
                <Suspense fallback={<CustomSkeleton variant="text" height={10} />}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {gallery.title}
                    </Typography>
                </Suspense>

                {gallery.image && (
                    <Box sx={{ mt: 2, mb: 3 }}>

                        <LazyImage
                            srcSet={getImageSrc(gallery.image)}
                            alt={`Gallery - ${gallery.title}`}
                            style={{
                                width: '640px',
                                height: 'auto',
                                maxHeight: '600px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    </Box>
                )}

                <Box
                    sx={{ mt: 2, fontSize: '16px', color: '#333' }}
                    dangerouslySetInnerHTML={{ __html: gallery.text }}
                />

                {gallery.link && (
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                        <Suspense fallback={<CustomSkeleton variant="text" width="100" height="20" />}>
                            <Typography
                                variant="body1"
                                component="a"
                                href={gallery.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: '#78884c',
                                    fontWeight: 'bold'
                                }}
                            >
                                Visitar Conteúdo Original <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                            </Typography>
                        </Suspense>
                        <Suspense fallback={<CustomSkeleton variant="text" width="30" height="20" />}>
                            <StarComponent id={gallery.id} />
                        </Suspense>
                        <Suspense fallback={<CustomSkeleton variant="text" width="30" height="20" />}>
                            <ViewComponent id={gallery.id} />
                        </Suspense>
                    </Stack>
                )}
            </ContentContainer>
            <Suspense fallback={<CustomSkeleton height={300} />}>
                <CommentBox itemID="Contents" />
            </Suspense>
            <Suspense fallback={null}>
                <SocialMetaTags
                    title={gallery.title}
                    image={gallery.image}
                    description={gallery.description}
                    url={`${window.location.origin}/GalleryDetail/${gallery.id}`}
                    type="article"
                />
            </Suspense>
        </>
    );
};

export default GalleryDetail;