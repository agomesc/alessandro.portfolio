import React, { useState, useEffect, lazy, Suspense } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LinkPreview = lazy(() => import("../Components/LinkPreview"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));

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
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
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
    };

    fetchAds();
  }, []);

  if (!randomAd) {
    return <LoadingMessage />;
  }

  const isValidLink = randomAd.isLink && randomAd.text?.startsWith("http");

  return (
    <Suspense fallback={<LoadingMessage />}>
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
          margin: "0 auto",
          padding: "0 10px",
        }}
      >
        <TypographyTitle src="Anúncio" />

        {isValidLink ? (
          <Link to={randomAd.text} target="_blank" style={{ textDecoration: "none" }}>
            <LinkPreview url={randomAd.text} />
          </Link>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>{randomAd.text}</Typography>
        )}

        <Link
          to="/ListContentWithPagination"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1 }} />
          {TITLE}
        </Link>
      </Box>
    </Suspense>
  );
};

export default React.memo(RandomAffiliateAd);
