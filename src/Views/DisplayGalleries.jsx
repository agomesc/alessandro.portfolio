import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom'; // Importe Link
import {
    Card, CardContent, Typography, Box, Pagination, Skeleton
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LazyImage = lazy(() => import("../Components/LazyImage"));

const DisplayGalleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const galleriesRef = collection(db, 'galleries');
                const q = query(galleriesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedGalleries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGalleries(fetchedGalleries);
            } catch (error) {
                console.error('Erro ao buscar galerias:', error);
            }
        };
        fetchGalleries();
    }, []);

    const totalPages = Math.ceil(galleries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = galleries.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" },
                margin: "0 auto",
                px: 2,
                mt: 10
            }}
        >
            <Suspense fallback={<Skeleton variant="text" height={60} width="30%" sx={{ mb: 3 }} />}>
                <TypographyTitle src="Conteúdos" />
            </Suspense>

            <Box
                ref={scrollRef}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 3,
                    pb: 2,
                    pt: 1,
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '4px',
                    },
                }}
            >
                {currentItems.map((gallery) => (
                    <Card
                        key={gallery.id}
                        // Use Link para navegar para a rota de detalhes
                        component={Link} // Renderiza o Card como um Link
                        to={`/GalleryDetail/${gallery.id}`} // Define o destino da rota
                        sx={{
                            cursor: 'pointer',
                            minWidth: 300,
                            maxWidth: 345,
                            flexShrink: 0,
                            textDecoration: 'none', // Remove sublinhado do Link
                            color: 'inherit', // Mantém a cor do texto padrão
                        }}
                    >
                        <Suspense fallback={<Skeleton variant="rectangular" width={320} height={240} />}>
                            {gallery.imagePath && (
                                <LazyImage
                                    src={`/images/${gallery.imagePath}`}
                                    alt={`Gallery-${gallery.id}`}
                                    width="100%"
                                    height="auto"
                                />
                            )}
                        </Suspense>

                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ color: '#78884c' }}>
                                {gallery.title}
                                {/* O ícone OpenInNewIcon agora pode indicar que o clique levará para uma página de detalhes */}
                            </Typography>
                            {gallery.link && (
                                <Box sx={{ mt: 1 }}>
                                    {/* Este link interno levaria para a página de detalhes, mas se você quiser um link externo específico, pode manter como estava */}
                                    <Typography
                                        variant="body2"
                                        component="a" // Permite que este seja um link externo separado
                                        href={gallery.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()} // Impede o clique do Card de propagar
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: '#78884c',
                                        }}
                                    >
                                        Abrir Link Externo <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="large"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
};

export default React.memo(DisplayGalleries);