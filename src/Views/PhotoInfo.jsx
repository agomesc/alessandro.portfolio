import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { Box, Skeleton } from "@mui/material";
import TypographyTitle from "../Components/TypographyTitle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData) {
      return {
        title: galleryData.title || "Informações da Foto",
        image: galleryData.url || "",
        description: galleryData.description || "",
      };
    }
    return {
      title: "Informações da Foto",
      image: "",
      description: "",
    };
  }, [galleryData]);

  const fetchData = useCallback(async () => {
    try {
      const data = await instance.getPhotoInfo(id);
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao buscar informações da foto:", error);
    }
  }, [id, instance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!galleryData) {
    return (
      <Box sx={{ mt: 10, px: 2 }}>
        <TypographyTitle src="Informações da Foto" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
        <Skeleton variant="text" sx={{ mt: 1 }} />
        <Skeleton variant="text" width="60%" />
      </Box>
    );
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
          margin: "0 auto",
          padding: "0 20px",
          mt: 10,
        }}
      >
        <Suspense fallback={<LoadingMessage />}>
          <TypographyTitle src="Informações da Foto" />
        </Suspense>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Suspense fallback={<Skeleton variant="rectangular" height={300} width="100%" />}>
            <PhotoDashboard photoData={galleryData} />
          </Suspense>
        </Box>

        <Suspense fallback={<Skeleton height={150} />}>
          <CommentBox itemID={id} />
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

export default React.memo(PhotoInfo);
