import React, { useEffect, useState, Suspense, lazy } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const LazyIframe = lazy(() => import("../Components/LazyIframe"));

const DisplayGalleries = () => {
    const [galleries, setGalleries] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);

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

    if (!galleries) {
        return <LoadingMessage />;
    }

    return (
        <Suspense fallback={<LoadingMessage />}>
            <Box
                sx={{
                    p: 0,
                    width: {
                        xs: "100%", // Para telas extra pequenas (mobile)
                        sm: "90%",  // Para telas pequenas
                        md: "80%",  // Para telas médias
                        lg: "70%",  // Para telas grandes
                        xl: "80%"   // Para telas extra grandes
                    },
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    padding: "0 20px",
                    mt: 10
                }}
            >
                <Suspense fallback={<LoadingMessage />}>
                    <TypographyTitle src="Conteúdos" />
                </Suspense>
                <Grid container spacing={3}>
                    {galleries.map((gallery) => (
                        <Grid item xs={12} sm={6} md={4} lg={5} xl={6} key={gallery.id}>
                            <Card onClick={() => handleOpen(gallery)} sx={{ cursor: 'pointer', maxWidth: 345 }}>
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
                        </Grid>
                    ))}
                </Grid>
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
            </Box >
        </Suspense >
    );
};

export default React.memo(DisplayGalleries);