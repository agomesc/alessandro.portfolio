import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import CommentBox from "../Components/comments";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";
import { Typography, Box } from "@mui/material";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData) {
      return {
        title: galleryData.title,
        image: galleryData.url,
        url: galleryData.description,
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
    <Suspense fallback={<LoadingMessage />}>
      <Box
        sx={{
          p: 0,
          width: "98%",
          alignContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
          Informações da Foto
        </Typography>
        <SocialMetaTags
          title={metaData.title}
          description={metaData.description}
          url={metaData.url}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <PhotoDashboard photoData={galleryData} />
        </Box>
        <CommentBox itemID={id} />
      </Box>
    </Suspense>
  );
};

export default React.memo(PhotoInfo);
