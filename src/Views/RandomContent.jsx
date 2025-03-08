import React, { useState, useEffect, lazy } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Typography } from '@mui/material';
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
    <>
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

    </>
  );
};

export default RandomAffiliateAd;