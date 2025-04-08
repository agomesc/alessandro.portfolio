import React, { useState, useEffect, lazy, Suspense } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Typography } from '@mui/material';
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LinkPreview = lazy(() => import('../Components/LinkPreview'));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));

const CACHE_KEY = 'randomAdCache';
const CACHE_EXPIRY_KEY = 'randomAdCacheExpiry';
const CACHE_DURATION_MS = 60 * 60 * 1000; // Cache for 1 hour

const title = "Seleção de Ofertas";

const RandomAffiliateAd = () => {
  const [randomAd, setRandomAd] = useState(null);

  const isCacheValid = () => {
    const expiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);
    return expiry && new Date().getTime() < new Date(expiry).getTime();
  };

  useEffect(() => {
    const fetchAds = async () => {
      if (isCacheValid()) {
        // Use cached data
        const cachedAd = JSON.parse(sessionStorage.getItem(CACHE_KEY));
        setRandomAd(cachedAd);
      } else {
        // Fetch new data
        const querySnapshot = await getDocs(collection(db, 'content'));
        const adsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleString(),
          }))
          .filter(ad => ad.isActive);

        if (adsData.length > 0) {
          const randomIndex = Math.floor(Math.random() * adsData.length);
          const selectedAd = adsData[randomIndex];
          setRandomAd(selectedAd);

          // Update cache
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(selectedAd));
          sessionStorage.setItem(CACHE_EXPIRY_KEY, new Date().getTime() + CACHE_DURATION_MS);
        }
      }
    };

    fetchAds();
  }, []);

  if (!randomAd) {
    return <LoadingMessage />;
  }

  return (
    <>
      <Suspense fallback={<LoadingMessage />}>
        <Box
          sx={{
            p: 0,
            width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
            alignContent: "center",
            alignItems: "center",
            margin: "0 auto",
            padding: "0 10px",
          }}
        >
          <TypographyTitle src="Anúncio" />
          {randomAd.isLink ? (
            <Link target='_blank' to={randomAd.text} style={{ textDecoration: 'none' }}>
              {randomAd && <LinkPreview url={randomAd.text} />}
            </Link>
          ) : (

            <Typography component="div" variant="body1">{randomAd.text}</Typography>
          )}


          <Link
            to="/ListContentWithPagination"
            style={{
              textDecoration: 'none',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingCartIcon style={{ marginRight: '5px' }} /> {title}
          </Link>
        </Box>
      </Suspense>
    </>
  );
};

export default React.memo(RandomAffiliateAd);