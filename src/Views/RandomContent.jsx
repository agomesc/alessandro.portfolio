import React, { useState, useEffect, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LinkPreview = lazy(() => import('../Components/LinkPreview'));

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
      <TypographyTitle src="Publicidade"></TypographyTitle>
      <Paper
        sx={{
          padding: '20px',
          marginX: 'auto',
          width: '100%',
          minWidth: '250px',
          wordBreak: 'break-word',
          textAlign: "center",
          boxShadow: 0,
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
