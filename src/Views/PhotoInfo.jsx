import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Skeleton,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import TypographyTitle from "../Components/TypographyTitle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const instance = useMemo(() => CreateFlickrApp(), []);

  const fetchInitialPhotoData = useCallback(async () => {
    try {
      const data = await instance.getPhotoInfo(id);
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao buscar informações iniciais da foto:", error);
    }
  }, [id, instance]);

  useEffect(() => {
    fetchInitialPhotoData();
  }, [fetchInitialPhotoData]);

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

  const fetchDetailedInfo = useCallback(async () => {
    if (!showAdditionalInfo) {
      try {
        // Caso queira buscar mais dados futuramente, pode usar esse trecho:
        // const detailedData = await instance.getDetailedPhotoInfo(id);
        // setGalleryData(prev => ({ ...prev, ...detailedData }));
        setShowAdditionalInfo(true);
      } catch (error) {
        console.error("Erro ao buscar informações adicionais da foto:", error);
      }
    }
  }, [showAdditionalInfo]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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
            <PhotoDashboard photoData={galleryData} onImageLoad={handleImageLoad} />
          </Suspense>
        </Box>

        {imageLoaded && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Tooltip title="Mostrar comentários e detalhes da foto">
              <IconButton
                aria-label="Mostrar informações adicionais"
                onClick={fetchDetailedInfo}
                color="primary"
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {showAdditionalInfo && (
          <>
            {/* Detalhes técnicos da foto (simulados ou futuros) */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detalhes da Foto
              </Typography>
              <Typography variant="body2">
                {/* Exemplo: você pode substituir por galleryData.exif?.cameraModel ou outro */}
                Câmera: {galleryData.camera || "Não disponível"} <br />
                Abertura: {galleryData.aperture || "Não disponível"} <br />
                Velocidade: {galleryData.shutter || "Não disponível"} <br />
                ISO: {galleryData.iso || "Não disponível"}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Suspense fallback={<Skeleton height={150} />}>
                <CommentBox itemID={id} />
              </Suspense>
            </Box>
          </>
        )}
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
