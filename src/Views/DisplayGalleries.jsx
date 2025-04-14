import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
    Card, CardContent, Typography, Dialog, DialogTitle,
    DialogContent, Box, IconButton
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const LazyIframe = lazy(() => import("../Components/LazyIframe"));

const DisplayGalleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
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

    const handleOpen = (gallery) => {
        setSelectedGallery(gallery);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedGallery(null);
    };

    return (
        <Suspense fallback={<LoadingMessage />}>
            <Box
                sx={{
                    width: {
                        xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%"
                    },
                    margin: "0 auto",
                    padding: "0 20px",
                    mt: 10
                }}
            >
                <Suspense fallback={<LoadingMessage />}>
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
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '4px',
                        },
                    }}
                >
                    {galleries.map((gallery) => (
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
                            {gallery.imagePath && (
                                <Suspense fallback={<LoadingMessage />}>
                                    <LazyIframe
                                        src={`https://drive.google.com/file/d/${gallery.imagePath}/preview`}
                                        title={`Gallery-${gallery.id}`}
                                    />
                                </Suspense>
                            )}
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
                                    <Suspense fallback={<LoadingMessage />}>
                                        <LazyIframe
                                            src={`https://drive.google.com/file/d/${selectedGallery.imagePath}/preview`}
                                            title={`Gallery-${selectedGallery.id}`}
                                        />
                                    </Suspense>
                                )}
                                <div
                                    style={{ marginTop: '20px', fontSize: '16px', color: '#333' }}
                                    dangerouslySetInnerHTML={{ __html: selectedGallery.text }}
                                />
                            </DialogContent>
                        </>
                    )}
                </Dialog>
            </Box>
        </Suspense>
    );
};

export default React.memo(DisplayGalleries);
