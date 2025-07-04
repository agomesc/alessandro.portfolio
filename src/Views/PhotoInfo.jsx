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
import InfoIcon from "@mui/icons-material/Info";
import TypographyTitle from "../Components/TypographyTitle";
import LoadingMessage from "../Components/LoadingMessage";
import CreateFlickrApp from "../shared/CreateFlickrApp"; // ajuste o caminho conforme seu projeto

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
   const instance = useMemo(() => CreateFlickrApp(), []);

  // Busca os dados básicos e EXIF juntos no carregamento inicial
  const fetchInitialPhotoData = useCallback(async () => {
    setLoadingInitialData(true);
    setError(null);
    try {
      const basicData = await instance.getPhotoBasicInfo(id);
      const exifData = await instance.getPhotoExifInfo(id);
      setGalleryData({ ...basicData, ...exifData });
    } catch (err) {
      console.error("Erro ao buscar informações iniciais da foto:", err);
      setError("Não foi possível carregar as informações da foto. Tente novamente mais tarde.");
    } finally {
      setLoadingInitialData(false);
    }
  }, [id]);

  // Agora o botão "Info" pode carregar dados adicionais ou comentários, se quiser,
  // aqui vou deixar só controle da exibição, pois já carregamos tudo de EXIF no início
  const handleShowAdditionalInfo = useCallback(() => {
    setShowAdditionalInfo(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Memoização para meta tags
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

  useEffect(() => {
    fetchInitialPhotoData();
  }, [fetchInitialPhotoData]);

  if (loadingInitialData) {
    return (
      <Box sx={{ mt: 10, px: 2, maxWidth: "80%", margin: "0 auto" }}>
        <TypographyTitle src="Informações da Foto" />
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ mt: 2, borderRadius: "8px" }}
        />
        <Skeleton variant="text" sx={{ mt: 2, fontSize: "2rem" }} />
        <Skeleton variant="text" sx={{ mt: 1, fontSize: "1rem", width: "80%" }} />
        <Skeleton
          variant="rectangular"
          height={40}
          width="100%"
          sx={{ mt: 3, borderRadius: "4px" }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 10, px: 2, textAlign: "center" }}>
        <TypographyTitle src="Erro" />
        <Typography component="div" color="error" variant="h6" sx={{ mt: 2 }}>
          {error}
        </Typography>
        <Typography component="div" variant="body1">
          Por favor, verifique sua conexão ou tente novamente mais tarde.
        </Typography>
        <IconButton onClick={fetchInitialPhotoData} color="primary" sx={{ mt: 2 }}>
          Tentar Novamente
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: 0,
          width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" },
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Tooltip title="Mostrar comentários e detalhes da foto">
              <IconButton
                aria-label="Mostrar informações adicionais"
                onClick={handleShowAdditionalInfo}
                color="primary"
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {showAdditionalInfo && (
          <>
            {/* Aqui você pode incluir comentários, ou qualquer info adicional */}
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
