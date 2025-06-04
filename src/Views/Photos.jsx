import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback
} from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomSkeleton from "../Components/CustomSkeleton"; // Novo componente
import CreateFlickrApp from "../shared/CreateFlickrApp";

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
      const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
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
    }
  }, [id, instance]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!galleryData) {
    return <CustomSkeleton height={300} />;
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
            xl: "80%"
          },
          margin: "0 auto",
          padding: "0 20px",
          mt: 10
        }}
      >
        <Suspense fallback={<CustomSkeleton height={80} />}>
          <TypographyTitle src="Minhas Fotos" />
        </Suspense>

        <Suspense fallback={<CustomSkeleton height={80} />}>
          <Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
            {galleryInfoData}
          </Typography>
        </Suspense>

        <Suspense fallback={<CustomSkeleton height={400} />}>
          <PhotoGallery photos={galleryData} />
        </Suspense>
      </Box>

      <Suspense fallback={<CustomSkeleton height={150} />}>
        <CommentBox itemID={id} />
      </Suspense>

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

export default React.memo(Photos);
