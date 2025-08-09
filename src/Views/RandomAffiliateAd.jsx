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

    <Box
      sx={(theme) => ({
        p: 0,
        width: {
          xs: "100%",
          sm: "90%",
          md: "80%",
          lg: "70%",
          xl: "80%",
        },
        alignContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: theme.customSpacing.pagePadding,
        mt: theme.customSpacing.sectionMarginTop,
      })}
    >
      <Suspense fallback={<Skeleton variant="text" height={10} />}>
        <TypographyTitle src="Anúncio" />
      </Suspense>
      <Suspense fallback={<Skeleton variant="text" height={10} />}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          Estes anúncios são cuidadosamente selecionados entre grandes lojas online. Ao comprar através deles, você me ajuda a continuar criando conteúdo — sem custo adicional para você. Obrigado pelo apoio! 💙
        </Typography>
      </Suspense>
      {isValidLink ? (
        <Suspense fallback={<Skeleton height={200} />}>
        <a
          href={randomAd.text}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: 'block' }}
        >
          <LinkPreview url={randomAd.text} />
        </a>
        </Suspense>
      ) : (

        <Suspense fallback={<Skeleton height={200} />}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {randomAd.text}
        </Typography>
        </Suspense>
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
  );
};

export default React.memo(RandomAffiliateAd);
