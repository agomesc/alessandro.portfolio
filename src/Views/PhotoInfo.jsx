import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
  useRef
} from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Skeleton,
  IconButton,
  Typography,
} from "@mui/material";

import CreateFlickrApp from "../shared/CreateFlickrApp";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));

const PhotoInfo = () => {
  const { id } = useParams();
  const [basicPhotoData, setBasicPhotoData] = useState(null);
  const [exifData, setExifData] = useState(null);
  const flickrInstance = useRef(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [loadingExifData, setLoadingExifData] = useState(false);
  const [error, setError] = useState(null);
  const [setImageLoaded] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  const fetchBasicPhotoData = useCallback(async () => {
    setLoadingInitialData(true);
    setError(null);
    try {
      const data = await flickrInstance.current.getPhotoBasicInfo(id);
      setBasicPhotoData(data);
    } catch (err) {
      console.error("Erro ao buscar informações básicas da foto:", err);
      setError("Não foi possível carregar as informações básicas da foto. Tente novamente mais tarde.");
    } finally {
      setLoadingInitialData(false);
    }
  }, [id]);

  const fetchExifInfo = useCallback(async () => {
    if (exifData || loadingExifData) return;

    setLoadingExifData(true);
    try {
      const data = await flickrInstance.current.getPhotoExifInfo(id);
      setExifData(data);
    } catch (err) {
      console.error("Erro ao buscar dados EXIF:", err);
    } finally {
      setLoadingExifData(false);
    }
  }, [id, exifData, loadingExifData]);

  const handleShowAdditionalInfo = useCallback(() => {
    setShowAdditionalInfo(prev => !prev);
    if (!showAdditionalInfo) {
      fetchExifInfo();
    }
  }, [showAdditionalInfo, fetchExifInfo]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const metaData = useMemo(() => {
    if (basicPhotoData) {
      return {
        title: basicPhotoData.title || "Informações da Foto",
        image: basicPhotoData.url || "",
        description: basicPhotoData.description || "",
      };
    }
    return {
      title: "Informações da Foto",
      image: "",
      description: "",
    };
  }, [basicPhotoData]);

  const combinedPhotoData = useMemo(() => ({
    ...basicPhotoData,
    ...(exifData || {}),
  }), [basicPhotoData, exifData]);

  useEffect(() => {
    fetchBasicPhotoData();
  }, [fetchBasicPhotoData]);

  if (loadingInitialData) {
    return (
      <ContentContainer sx={{ mt: 20 }}>
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
      </ContentContainer>
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
        <IconButton onClick={fetchBasicPhotoData} color="primary" sx={{ mt: 2 }}>
          Tentar Novamente
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <ContentContainer sx={{ mt: 20 }}>
        <Suspense fallback={<CustomSkeleton />}>
          <TypographyTitle src="Informações da Foto" />
        </Suspense>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Suspense fallback={<CustomSkeleton />}>
            <PhotoDashboard
              photoData={combinedPhotoData}
              onImageLoad={handleImageLoad}
              showAdditionalInfo={showAdditionalInfo}
              onShowAdditionalInfo={handleShowAdditionalInfo}
              loadingExif={loadingExifData}
            />
          </Suspense>
        </Box>
        {showAdditionalInfo && loadingExifData && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Suspense fallback={<CustomSkeleton />}>
              <Typography variant="body1">Carregando detalhes EXIF...</Typography>
            </Suspense>
            <Skeleton height={150} sx={{ mt: 1 }} />
          </Box>
        )}

        <Suspense fallback={<CustomSkeleton />}>
          <CommentBox itemID={id} />
        </Suspense>
      </ContentContainer>
      <Suspense fallback={<CustomSkeleton />}>
        <SocialMetaTags
          title={metaData.title}
          image={metaData.image}
          description={metaData.description}
          url={`${window.location.origin}/photo/${id}`}
          type="website"
        />
      </Suspense>
    </>
  );
};

export default React.memo(PhotoInfo);
