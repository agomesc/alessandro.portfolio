import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Grid, Card, CardContent, CardMedia, Typography, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

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

    return (
        <Box
            sx={{
                p: 0,
                width: "auto",
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: "0 10px",
            }}
        >
            <Typography variant="h4" component="h1">Galerias</Typography>
            <Grid container spacing={3}>
                {galleries.map((gallery) => (
                    <Grid item xs={12} sm={6} md={4} key={gallery.id}>
                        <Card onClick={() => handleOpen(gallery)} sx={{ cursor: 'pointer', maxWidth: 345 }}>
                            {gallery.imagePath && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    media="photo"
                                    loading="lazy"
                                    image={`https://drive.google.com/uc?export=view&id=${gallery.imagePath}`}
                                    alt={gallery.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {gallery.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                {selectedGallery && (
                    <>
                        <DialogTitle>{selectedGallery.title}</DialogTitle>
                        <DialogContent>
                            {selectedGallery.imagePath && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    media="photo"
                                    loading="lazy"
                                    image={`https://drive.google.com/uc?export=view&id=${selectedGallery.imagePath}`}
                                    alt={selectedGallery.title}
                                    sx={{ mb: 2 }}
                                />
                            )}
                            <Typography variant="body1">{selectedGallery.text}</Typography>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default DisplayGalleries;