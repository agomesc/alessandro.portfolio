import { useEffect, useState, Suspense, lazy, useMemo, useRef } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import Box from "@mui/material/Box";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const LatestPhotos = () => {
  const [galleryData, setGalleryData] = useState(null);
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  useEffect(() => {
    if (!galleryData) {
      flickrInstance.current.getLatestPhotosWork().then(setGalleryData);
    }
  }, [galleryData]);

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

  return (
    <Suspense fallback={<CustomSkeleton />}>
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
        <TypographyTitle src="Atualizações" />
        <PhotoGrid itemData={galleryData} />
        <CommentBox itemID="LatestPhotosWorks" />
      </Box>
      <SocialMetaTags
        title={metaData.title}
        image={metaData.image}
        description={metaData.description}
      />
    </Suspense>);
};

export default LatestPhotos;
