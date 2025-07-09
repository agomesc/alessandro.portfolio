import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import Skeleton from '@mui/material/Skeleton';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Gallery = () => {
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData?.length) {
      const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
      return {
        title: randomItem.title,
        description: randomItem.description,
        img: randomItem.img,
      };
    }
    return null;
  }, [galleryData]);

  useEffect(() => {
    if (!galleryData) {
      instance.getGallerySmall().then(setGalleryData).catch(console.error);
    }
  }, [galleryData, instance]);

  if (!galleryData) {
    return <Skeleton variant="rectangular" height={300} width="100%" />;
  }

  return (
    <>
      <Box
        sx={{
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
          padding: "0 20px",
          mt: 10,
        }}
      >
          <Suspense fallback={<Skeleton variant="rectangular" height={300} width="100%" />}>
          <TypographyTitle src="Galeria de Fotos" />
        </Suspense>
        <ImageThumbs data={galleryData} />

      </Box>


      <CommentBox itemID="Gallery" />


      {metaData && (
        
          <SocialMetaTags
            title={metaData.title}
            image={metaData.img}
            description={metaData.description}
          />
        
      )}
    </>
  );
};

export default React.memo(Gallery);
