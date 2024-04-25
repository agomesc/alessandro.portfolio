import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { List, ListItem, Paper } from '@mui/material';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinkPreview from '../Components/LinkPreview'

const AffiliateAdList = () => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        const fetchAds = async () => {
            const querySnapshot = await getDocs(collection(db, 'AffiliateAd'));
            const adsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleString(),
                // Supõe-se que a propriedade isActive seja um booleano
            })).filter(ad => ad.isActive); // Filtra apenas os anúncios ativos
            setAds(adsData);
        };

        fetchAds();
    }, []);

    return (
        <Box sx={{ p: 0, width: "80%", height: "auto", alignContent: "center", alignItems: "center", margin: "0 auto" }}>
            <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
                Seu Guia Afiliado para as Melhores Compras Online!
            </Typography>
            <Paper >
                <List>
                    {ads.map((ad) => (
                        <ListItem key={ad.id} style={{ padding: '20px', margin: '20px', justifyContent: "center" }}>
                            {ad.isLink ? (
                                <LinkPreview url={ad.text} />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: ad.text }} />
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default  React.memo(AffiliateAdList);
