import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { List, ListItem, Paper } from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const AffiliateAdList = () => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            const querySnapshot = await getDocs(collection(db, 'AffiliateAd'));
            const adsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleString() // Formata a data
            }));
            setAds(adsData);
        };

        fetchAds();
    }, []);

    return (
        <Box sx={{ p: 0, width: "80%", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
            <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
                Seu Guia Afiliado para as Melhores Compras Online!
            </Typography>
            <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                <List>
                    {ads.map((ad) => (
                        <ListItem key={ad.id}>
                            <div dangerouslySetInnerHTML={{ __html: ad.text }} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default AffiliateAdList;
