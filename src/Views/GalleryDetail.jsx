import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Box, Typography, CircularProgress, Alert, Skeleton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const LazyImage = React.lazy(() => import("../Components/LazyImage")); // Assumindo que LazyImage está em Components

const GalleryDetail = () => {
    const { id } = useParams(); // Pega o ID da URL
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
                <Alert severity="info">Nenhuma galeria selecionada.</Alert>
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
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#78884c' }}>
                {gallery.title}
            </Typography>

            {gallery.imagePath && (
                <Box sx={{ mt: 2, mb: 3 }}>
                    <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={400} />}>
                        <LazyImage
                            src={`/images/${gallery.imagePath}`}
                            alt={`Gallery-${gallery.id}`}
                            width={320}
                            height="auto"
                            style={{ maxHeight: '600px', objectFit: 'contain' }}
                        />
                    </Suspense>
                </Box>
            )}

            <Box
                sx={{ mt: 2, fontSize: '16px', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: gallery.text }}
            />

            {gallery.link && (
                <Box sx={{ mt: 3, display:"flex" }}>
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
                </Box>
            )}
        </Box>
    );
};

export default GalleryDetail;