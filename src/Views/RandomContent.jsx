import React, { useState, useEffect, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Box from "@mui/material/Box";
import { Paper, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LinkPreview = lazy(() => import('../Components/LinkPreview'));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));

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

    if (!randomAd) fetchAds();
  }, []);


  if (!randomAd) {
    return <LoadingMessage />;
  }

  return (
    <Box
      sx={{
        p: 0,
        width: "90%",
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <TypographyTitle src="Publicidade"></TypographyTitle>
      <Paper
        sx={{
          padding: '20px',
          wordBreak: 'break-word',
          textAlign: "center",
          boxShadow: 0,
          minWidth: '600px',
          margin: "0 auto",
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
