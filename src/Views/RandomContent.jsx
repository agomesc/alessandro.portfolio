import React, { useState, useEffect, lazy, Suspense } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Skeleton from '@mui/material/Skeleton';
import { Link } from "react-router-dom";  // <-- IMPORTAÇÃO CORRETA DO LINK

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LinkPreview = lazy(() => import("../Components/LinkPreview"));

const CACHE_KEY = "randomAdCache";
const CACHE_EXPIRY_KEY = "randomAdCacheExpiry";
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hora
const TITLE = "Seleção de Ofertas";

const RandomAffiliateAd = () => {
  const [randomAd, setRandomAd] = useState(null);

  const isCacheValid = () => {
    const expiry = sessionStorage.getItem(CACHE_EXPIRY_KEY);
    return expiry && Date.now() < parseInt(expiry, 10);
  };

  const getCachedAd = () => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      if (isCacheValid()) {
        const cachedAd = getCachedAd();
        if (cachedAd) {
          setRandomAd(cachedAd);
          return;
        }
      }

      try {
        const querySnapshot = await getDocs(collection(db, "content"));
        const adsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleString(),
          }))
          .filter(ad => ad.isActive);

        if (adsData.length > 0) {
          const selectedAd = adsData[Math.floor(Math.random() * adsData.length)];
          setRandomAd(selectedAd);

          sessionStorage.setItem(CACHE_KEY, JSON.stringify(selectedAd));
          sessionStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION_MS).toString());
        }
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };

    fetchAds();
  }, []);

  if (!randomAd) {
    return <Skeleton variant="rectangular" height={100} />;
  }

  const isValidLink = randomAd.isLink && randomAd.text?.startsWith("http");

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
      <Box
        sx={{
          p: 0,
          width: {
            xs: "90%", // Para telas extra pequenas (mobile)
            sm: "80%",  // Para telas pequenas
            md: "70%",  // Para telas médias
            lg: "60%",  // Para telas grandes
            xl: "50%"   // Para telas extra grandes
          },
          alignContent: "center",
          alignItems: "center",
          margin: "0 auto",
          padding: "0 20px",
          mt: 10
        }}
      >
        <TypographyTitle src="Anúncio" />

        {isValidLink ? (
          <a
            href={randomAd.text}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: 'block' }}
          >
            <LinkPreview url={randomAd.text} />
          </a>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {randomAd.text}
          </Typography>
        )}

        <Box
          component={Link}
          to="/ListContentWithPagination"
          sx={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          {TITLE}
        </Box>
      </Box>
    </Suspense>
  );
};

export default React.memo(RandomAffiliateAd);
