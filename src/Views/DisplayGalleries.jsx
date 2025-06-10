import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    Card, CardContent, Typography, Dialog, DialogTitle,
    DialogContent, Box, IconButton, Pagination, Skeleton
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LazyImage = lazy(() => import("../Components/LazyImage"));

const DisplayGalleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                const galleriesRef = collection(db, 'galleries');
                const q = query(galleriesRef, where('isActive', '==', true));
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

    const handleOpen = (gallery) => {
        setSelectedGallery(gallery);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGallery(null);
    };

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
                        onClick={() => handleOpen(gallery)}
                        sx={{
                            cursor: 'pointer',
                            minWidth: 300,
                            maxWidth: 345,
                            flexShrink: 0,
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
                                <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                            </Typography>
                            {gallery.link && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography
                                        variant="body2"
                                        component="a"
                                        href={gallery.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: '#78884c',
                                        }}
                                    >
                                        Abrir Link <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
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

            {/* Modal */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xl"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '90%',
                        height: '90%',
                    },
                }}
            >
                {selectedGallery && (
                    <>
                        <DialogTitle>
                            {selectedGallery.title}
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            {selectedGallery.imagePath && (
                                <Box sx={{ mt: 2, mb: 3 }}>
                                    <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={300} />}>
                                        <LazyImage
                                            src={`/images/${selectedGallery.imagePath}`}
                                            alt={`Gallery-${selectedGallery.id}`}
                                            width="100%"
                                            height="auto"
                                        />
                                    </Suspense>
                                </Box>
                            )}
                            <Box
                                sx={{ mt: 2, fontSize: '16px', color: '#333' }}
                                dangerouslySetInnerHTML={{ __html: selectedGallery.text }}
                            />
                            {selectedGallery.link && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="body2"
                                        component="a"
                                        href={selectedGallery.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textDecoration: 'none',
                                            color: '#78884c',
                                        }}
                                    >
                                        Abrir Link <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default React.memo(DisplayGalleries);
