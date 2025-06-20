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
import LoadingMessage from "../Components/LoadingMessage"; // Consider a more specific skeleton for comments

const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true); // New loading state
  const [error, setError] = useState(null); // New error state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const instance = useMemo(() => CreateFlickrApp(), []);

  // Fetch initial photo data (title, URL, description)
  const fetchInitialPhotoData = useCallback(async () => {
    setLoadingInitialData(true);
    setError(null);
    try {
      const data = await instance.getPhotoInfo(id); // This is your potentially heavy call
      setGalleryData(data);
    } catch (err) {
      console.error("Erro ao buscar informações iniciais da foto:", err);
      setError("Não foi possível carregar as informações da foto. Tente novamente mais tarde.");
    } finally {
      setLoadingInitialData(false);
    }
  }, [id, instance]);

  useEffect(() => {
    fetchInitialPhotoData();
  }, [fetchInitialPhotoData]);

  // Memoize meta data for SEO
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

  // Only fetch additional info when the button is clicked
  const handleShowAdditionalInfo = useCallback(() => {
    // This part is effectively just setting a state to render lazy-loaded components
    // If 'getDetailedPhotoInfo' was a separate *heavy* call, it would be here.
    // Since it's currently commented out, simply setting the state is enough.
    setShowAdditionalInfo(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // --- Loading and Error States ---
  if (loadingInitialData) {
    return (
      <Box sx={{ mt: 10, px: 2, maxWidth: '80%', margin: '0 auto' }}>
        <TypographyTitle src="Informações da Foto" />
        {/* Improved Skeleton for main content */}
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2, borderRadius: '8px' }} />
        <Skeleton variant="text" sx={{ mt: 2, fontSize: '2rem' }} /> {/* For title */}
        <Skeleton variant="text" sx={{ mt: 1, fontSize: '1rem', width: '80%' }} /> {/* For description/author */}
        <Skeleton variant="rectangular" height={40} width="100%" sx={{ mt: 3, borderRadius: '4px' }} /> {/* For button area */}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 10, px: 2, textAlign: 'center' }}>
        <TypographyTitle src="Erro" />
        <Typography component="div" color="error" variant="h6" sx={{ mt: 2 }}>
          {error}
        </Typography>
        <Typography component="div" variant="body1">
          Por favor, verifique sua conexão ou tente novamente mais tarde.
        </Typography>
        {/* Optionally, a retry button */}
        <IconButton onClick={fetchInitialPhotoData} color="primary" sx={{ mt: 2 }}>
          Tentar Novamente
        </IconButton>
      </Box>
    );
  }

  // --- Main Content Render ---
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
                onClick={handleShowAdditionalInfo} // Use the new handler
                color="primary"
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {showAdditionalInfo && (
          <>
            {/* Detalhes técnicos da foto */}
            <Box sx={{ mt: 3 }}>
              <Typography component="div" variant="h6" gutterBottom>
                Detalhes da Foto
              </Typography>
              <Typography component="div" variant="body2">
                Câmera: {galleryData.camera || "Não disponível"} <br />
                Abertura: {galleryData.aperture || "Não disponível"} <br />
                Velocidade: {galleryData.shutter || "Não disponível"} <br />
                ISO: {galleryData.iso || "Não disponível"}
              </Typography>
            </Box>

            {/* Comment Box */}
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