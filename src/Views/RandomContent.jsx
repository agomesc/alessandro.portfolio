import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';
import LinkPreview from '../Components/LinkPreview';
import { Link } from "react-router-dom";

const RandomAffiliateAd = () => {
  const [randomAd, setRandomAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      const querySnapshot = await getDocs(collection(db, 'content'));
      const adsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleString()
        }))
        .filter(ad => ad.isActive);

      if (adsData.length > 0) {
        const randomIndex = Math.floor(Math.random() * adsData.length);
        setRandomAd(adsData[randomIndex]);
      }
    };

    fetchAds();
  }, []);

  return (
    <Box
      sx={{ mt: 2, pt: 2, display: "flex", justifyContent: "center" }}
    >
      <Paper
        sx={{
          padding: '20px',
          marginX: 'auto', // Centraliza horizontalmente
          maxWidth: '600px', // Controla a largura
          width: '100%',
          wordBreak: 'break-word', // Impede quebra de layout com links longos
          textAlign: "center",
          boxShadow: 0, // Adiciona um leve destaque
        }}
      >
        {randomAd ? (
          randomAd.isLink ? (
            <Link target='_blank' to={randomAd.text} style={{ textDecoration: 'none' }}>
              <LinkPreview url={randomAd.text} />
            </Link>
          ) : (
            <Typography variant="body1">{randomAd.text}</Typography>
          )
        ) : (
          <Typography variant="body1">Carregando anúncio...</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default RandomAffiliateAd;
