import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // Importa o ícone

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
            <Typography variant="h4" component="h1">Conteúdos</Typography>
            <Grid container spacing={3}>
                {galleries.map((gallery) => (
                    <Grid item xs={12} sm={6} md={4} key={gallery.id}>
                        <Card onClick={() => handleOpen(gallery)} sx={{ cursor: 'pointer', maxWidth: 345 }}>
                            {gallery.imagePath && (
                                <div style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    width: '100%',
                                    paddingTop: '56.25%' /* Aspect ratio: 16:9 */
                                }}>
                                    <iframe
                                        src={`https://drive.google.com/file/d/${gallery.imagePath}/preview`}
                                        title={`Gallery-${gallery.id}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 0
                                        }}
                                    ></iframe>
                                </div>
                            )}
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {gallery.title}
                                </Typography>
                            </CardContent>
                        </Card>
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
                                        color: 'primary.main',
                                    }}
                                >
                                    Abrir Link <OpenInNewIcon sx={{ ml: 0.5, fontSize: 'small' }} />
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                {selectedGallery && (
                    <>
                        <DialogTitle>{selectedGallery.title}</DialogTitle>
                        <DialogContent>
                            {selectedGallery.imagePath && (
                                <div style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    width: '100%',
                                    paddingTop: '56.25%' /* Aspect ratio: 16:9 */
                                }}>
                                    <iframe
                                        src={`https://drive.google.com/file/d/${selectedGallery.imagePath}/preview`}
                                        title={`Gallery-${selectedGallery.id}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 0
                                        }}
                                    ></iframe>
                                </div>
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