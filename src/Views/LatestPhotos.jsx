import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CommentBox = lazy(() => import("../Components/CommentBox"));

const LatestPhotos = () => {
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  useEffect(() => {
    if (!galleryData) {
      instance.getLatestPhotosMedium().then(setGalleryData);
    }
  }, [galleryData, instance]);

  // Memoizando os metadados para social tags
  const metaData = useMemo(() => {
    if (galleryData?.length > 0) {
      const randomIndex = Math.floor(Math.random() * galleryData.length);
      const randomItem = galleryData[randomIndex];
      return {
        title: randomItem.title || "Atualizações",
        description: randomItem.description || "Últimas atualizações da galeria.",
        image: randomItem.img || '/public/logo_192.png',
      };
    }
    return {
      title: "Atualizações",
      description: "Últimas atualizações da galeria.",
      image: '/logo_192.png',
    };
  }, [galleryData]);

  if (!galleryData) return <LoadingMessage />;

  return (
    <>
      <Box
        sx={{
          p: 0,
          width: {
            xs: "100%", // Para telas extra pequenas (mobile)
            sm: "90%",  // Para telas pequenas
            md: "80%",  // Para telas médias
            lg: "70%",  // Para telas grandes
            xl: "80%"   // Para telas extra grandes
          },
          alignContent: "center",
          alignItems: "center",
          margin: "0 auto",
          padding: "0 20px",
          mt: 10
        }}
      >
        <Suspense fallback={<LoadingMessage />}>
          <TypographyTitle src="Atualizações" />
        </Suspense>

        <Suspense fallback={<LoadingMessage />}>
          <PhotoGrid itemData={galleryData} />
        </Suspense>
      </Box>

      <Suspense fallback={<LoadingMessage />}>
        <CommentBox itemID="LatestPhotos" />
      </Suspense>

      <Suspense fallback={<LoadingMessage />}>
        <SocialMetaTags
          title={metaData.title}
          image={metaData.image}
          description={metaData.description}
        />
      </Suspense>
    </>
  );
};

export default React.memo(LatestPhotos);
