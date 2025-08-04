import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
import Box from "@mui/material/Box";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Gallery = () => {
  const [galleryData, setGalleryData] = useState(null);
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  useEffect(() => {
    if (!galleryData) {
      flickrInstance.current.getGallerySmall().then(setGalleryData).catch(console.error);
    }
  }, [galleryData]);

  if (!galleryData) {
    return <CustomSkeleton />;
  }

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
        <Suspense fallback={<CustomSkeleton />}>
          <TypographyTitle src="Galeria de Fotos" />
        </Suspense>
        <Suspense fallback={<CustomSkeleton />}>
          <ImageThumbs data={galleryData} />
        </Suspense>
      </Box>
      <Suspense fallback={<CustomSkeleton />}>
        <CommentBox itemID="Gallery" />
      </Suspense>
      <Suspense fallback={<CustomSkeleton />}>
      <SocialMetaTags
        title={galleryData[0]?.title || "Galeria de Fotos"}
        image={galleryData[0]?.img || "/logo_192.png"}
        description={galleryData[0]?.description || "Galeria de Fotos"}
        url={`${window.location.origin}/gallery`}
        type="website" />
      </Suspense>
    </>
  );
};

export default React.memo(Gallery);
