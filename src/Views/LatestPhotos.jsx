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
      instance.getLatestPhotos().then(setGalleryData);
    }
  }, [galleryData, instance]);

  const metaData = useMemo(() => {
    if (galleryData?.length > 0) {
      const randomIndex = Math.floor(Math.random() * galleryData.length);
      const randomItem = galleryData[randomIndex];
      return {
        title: randomItem.title || "Atualizações",
        description: randomItem.description || "Últimas atualizações da galeria.",
        image: randomItem.img || "/logo_192.png",
      };
    }
    return {
      title: "Atualizações",
      description: "Últimas atualizações da galeria.",
      image: "/logo_192.png",
    };
  }, [galleryData]);

  if (!galleryData) return <LoadingMessage />;

  return (
    <>
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
        <Suspense fallback={<LoadingMessage />}>
          <TypographyTitle src="Atualizações" />
        </Suspense>

        <Suspense fallback={<LoadingMessage />}>
          <PhotoGrid itemData={galleryData} />
        </Suspense>

        <Suspense fallback={<LoadingMessage />}>
          <CommentBox itemID="LatestPhotos" />
        </Suspense>
      </Box>

      <Suspense fallback={null}>
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
