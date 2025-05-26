import React, { useEffect, useState, Suspense, lazy, useMemo, useCallback } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from '@mui/material/Skeleton';

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [galleryInfoData, setGalleryInfoData] = useState("");
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData?.length > 0) {
      const randomIndex = Math.floor(Math.random() * galleryData.length);
      const randomItem = galleryData[randomIndex];
      return {
        title: randomItem.title || "Galeria de Fotos",
        image: randomItem.url || "",
        description: randomItem.title || "Veja as fotos dessa galeria."
      };
    }
    return {
      title: "Galeria de Fotos",
      image: "",
      description: "Veja as fotos dessa galeria."
    };
  }, [galleryData]);

  const fetchData = useCallback(async () => {
    try {
      const data = await instance.getPhotosLarge(id);
      setGalleryData(data);

      const albumInfo = await instance.getAlbum(id);
      setGalleryInfoData(albumInfo?.description?._content || "");
    } catch (error) {
      console.error("Erro ao carregar a galeria:", error);
      // Poderia setar um estado de erro aqui para feedback ao usuário, se quiser
    }
  }, [id, instance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!galleryData) {
    return <Skeleton variant="rectangular" height={300} />;
  }

  return (
    <>
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <Box
          sx={{
            p: 0,
            width: {
              xs: "100%",
              sm: "90%",
              md: "80%",
              lg: "70%",
              xl: "80%"
            },
            alignContent: "center",
            alignItems: "center",
            margin: "0 auto",
            padding: "0 20px",
            mt: 10
          }}
        >
          <TypographyTitle src="Minhas Fotos" />
          <Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
            {galleryInfoData}
          </Typography>
          <PhotoGallery photos={galleryData} />
        </Box>

        <CommentBox itemID={id} />
        <SocialMetaTags
          title={metaData.title}
          image={metaData.image}
          description={metaData.description}
        />
      </Suspense>
    </>
  );
};

export default React.memo(Photos);
