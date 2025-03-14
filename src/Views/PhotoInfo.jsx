import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";


const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData) {
      return {
        title: galleryData.title,
        image: galleryData.url,
        description: galleryData.description,
      };
    }
  }, [galleryData]);

  const fetchData = useCallback(async () => {
    const data = await instance.getPhotoInfo(id);
    setGalleryData(data);
  }, [id, instance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!galleryData) {
    return <LoadingMessage />;
  }

  return (
    <>
      <Suspense fallback={<LoadingMessage />}>
        <Box
          sx={{
            p: 0,
            width: { xs: "100%", sm: "90%" },
            alignContent: "center",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <TypographyTitle src="Informações da Foto" />

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <PhotoDashboard photoData={galleryData} />
          </Box>
        </Box>
        <CommentBox itemID={id} />
      </Suspense>
      <SocialMetaTags
        title={metaData.title}
        image={metaData.url}
        description={metaData.description}
      />
    </>
  );
};

export default React.memo(PhotoInfo);
