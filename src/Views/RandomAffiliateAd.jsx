import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';

const RandomAffiliateAd = () => {
  const [randomAd, setRandomAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      const querySnapshot = await getDocs(collection(db, 'AffiliateAd'));
      const adsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleString() // Formata a data
      }));
      // Seleciona um anúncio aleatório da lista
      const randomIndex = Math.floor(Math.random() * adsData.length);
      setRandomAd(adsData[randomIndex]);
    };

    fetchAds();
  }, []);

  return (
    <Box sx={{ pt: 4, display: "fixed", justifyContent: "center" }}>
      <Paper style={{ padding: '20px', margin: '20px', justifyContent: "center" }}>
        {randomAd ? (
          <div dangerouslySetInnerHTML={{ __html: randomAd.text }} />
        ) : (
          <Typography variant="body1">Carregando anúncio...</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default RandomAffiliateAd;
