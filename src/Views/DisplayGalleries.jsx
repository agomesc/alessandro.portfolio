import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';

const DisplayGalleries = () => {
    const [galleries, setGalleries] = useState([]);

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
                console.error('Erro ao buscar galerias:', error.message);
            }
        };

        fetchGalleries();
    }, []);

    return (
        <Box sx={{ p: 0, width: "90%", alignContent: "center", alignItems: "center", margin: "0 auto", mt: 50 }}>
            {galleries.map(({ id, title, text, imagePath }) => (
                <Card key={id} sx={{ maxWidth: 345, m: 2 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={imagePath}
                        alt={title}
                    />
                    <CardContent>
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {text}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default DisplayGalleries;