import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig.jsx';
import { Link } from 'react-router-dom';
import {
    Card, CardContent, Typography, Box, Pagination, Skeleton, Button
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


const TypographyTitle = lazy(() => import("../Components/TypographyTitle.jsx"));
const LazyImage = lazy(() => import("../Components/LazyImage.jsx"));

const App = () => {
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
                if (fetchedGalleries.length === 0) {
                    console.warn('Nenhuma galeria ativa encontrada ou problema na query/índices.');
                }
            } catch (error) {
                console.error('Erro ao buscar galerias:', error);
            }
        };
        fetchGalleries();
    }, []);

    const sortedGalleries = [...galleries].sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
    });

    const totalPages = Math.ceil(sortedGalleries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedGalleries.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleExternalLinkClick = (e, link) => {
        e.stopPropagation();
        window.open(link, '_blank', 'noopener noreferrer');
    };

    return (
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
            <Suspense fallback={<Skeleton variant="text" height={60} width="30%" sx={{ mb: 3 }} />}>
                <TypographyTitle src="Conteúdos" />
            </Suspense>

            {/* Changed display to 'block' for vertical stacking of cards */}
            <Box
                ref={scrollRef}
                sx={{
                    display: 'block', // Changed from flex to block for vertical stacking
                    gap: 3, // Still good for spacing between vertically stacked cards
                    pb: 2,
                    pt: 1,
                    overflowX: 'hidden', // No horizontal scroll needed now
                }}
            >
                {currentItems.map((gallery) => (
                    <Card
                        key={gallery.id}
                        component={Link}
                        to={`/GalleryDetail/${gallery.id}`}
                        sx={{
                            cursor: 'pointer',
                            mb: 3, // Add bottom margin to separate vertical cards
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex', // Enable flexbox for image-left, text-right layout
                            flexDirection: { xs: 'column', sm: 'row' }, // Stack image/text vertically on small screens, horizontally on larger
                            alignItems: 'center', // Vertically align items
                            minWidth: 'unset', // Remove fixed minWidth for flexible layout
                            maxWidth: '100%', // Take full width
                            width: '100%', // Ensure card takes full available width
                        }}
                    >
                        <Suspense fallback={<Skeleton variant="rectangular" width={240} height={240} />}>
                            {gallery.image && (
                                <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 240 }, height: { xs: 240, sm: 'auto' }, overflow: 'hidden' }}>
                                    <LazyImage
                                        src={gallery.image}
                                        alt={`Gallery - ${gallery.title}`}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }} // Ensure image covers its container
                                    />
                                </Box>
                            )}
                            {!gallery.image && (
                                <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 240 }, height: 240, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography component="div" variant="caption" color="text.secondary">Sem Imagem</Typography>
                                </Box>
                            )}
                        </Suspense>

                        <CardContent sx={{ flexGrow: 1, p: 2 }}> {/* Allow content to grow */}
                            <Suspense fallback={<Skeleton variant="text" width={240} height={100} />}>
                                <Typography variant="h6" component="div" sx={{ color: '#78884c' }}>
                                    {gallery.title}
                                </Typography>
                            </Suspense>
                            <Suspense fallback={<Skeleton variant="text" width={240} height={100} />}>
                                <Box
                                    sx={{ mt: 2, fontSize: '16px', color: '#333' }}
                                    dangerouslySetInnerHTML={{ __html: gallery.text.slice(0, 255) + '...' }}
                                />
                            </Suspense>

                            {gallery.link && (
                                <Box sx={{ mt: 1 }}>
                                    <Suspense fallback={<Skeleton variant="text" width={240} height={100} />}>

                                        <Typography
                                            variant="body2"
                                            component="span"
                                            onClick={(e) => handleExternalLinkClick(e, gallery.link)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                textDecoration: 'underline',
                                                color: '#78884c',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: '#5a6b38',
                                                }
                                            }}
                                        >
                                            Abrir Link Externo <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                        </Typography>
                                    </Suspense>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {totalPages > 1 && (
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
            )}
        </Box>
    );
};

export default App;