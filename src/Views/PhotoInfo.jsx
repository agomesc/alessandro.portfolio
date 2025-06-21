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
  CircularProgress // Adicionado para indicar carregamento de detalhes
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import TypographyTitle from "../Components/TypographyTitle";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";

// Lazy loading para componentes maiores/menos críticos inicialmente
const PhotoDashboard = lazy(() => import("../Components/PhotoDashboard"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const PhotoInfo = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true); // Estado para o carregamento inicial da foto e título
  const [error, setError] = useState(null); // Estado para erros no carregamento inicial
  const [imageLoaded, setImageLoaded] = useState(false); // Estado para saber se a imagem principal carregou
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false); // Controla a visibilidade dos detalhes adicionais (EXIF e comentários)
  const [loadingAdditionalInfo, setLoadingAdditionalInfo] = useState(false); // Estado para o carregamento dos detalhes adicionais (EXIF)
  const [additionalInfoError, setAdditionalInfoError] = useState(null); // Estado para erros no carregamento dos detalhes adicionais

  // Memoiza a instância da API Flickr para evitar recriação desnecessária
  const instance = useMemo(() => CreateFlickrApp(), []);

  // --- Funções de Carregamento de Dados ---

  // Função para buscar os dados iniciais da foto (título, URL, descrição)
  const fetchInitialPhotoData = useCallback(async () => {
    setLoadingInitialData(true);
    setError(null);
    try {
      const data = await instance.getPhotoInfo(id); // Chamada para obter informações básicas
      setGalleryData(data);
    } catch (err) {
      console.error("Erro ao buscar informações iniciais da foto:", err);
      setError("Não foi possível carregar as informações da foto. Tente novamente mais tarde.");
    } finally {
      setLoadingInitialData(false);
    }
  }, [id, instance]);

  // Função para buscar dados adicionais da foto (como EXIF)
  // Esta função é chamada SOMENTE quando o botão "Info" é clicado
  const fetchAdditionalPhotoData = useCallback(async () => {
    setLoadingAdditionalInfo(true);
    setAdditionalInfoError(null);
    try {
      // Supondo que 'getDetailedPhotoInfo' é o método que retorna os dados EXIF
      const detailedData = await instance.getDetailedPhotoInfo(id);
      // Mescla os dados detalhados com os dados já existentes da galeria
      setGalleryData(prevData => ({ ...prevData, ...detailedData }));
    } catch (err) {
      console.error("Erro ao buscar informações adicionais da foto:", err);
      setAdditionalInfoError("Não foi possível carregar os detalhes adicionais da foto.");
    } finally {
      setLoadingAdditionalInfo(false);
    }
  }, [id, instance]);

  // Efeito para carregar os dados iniciais assim que o componente é montado
  useEffect(() => {
    fetchInitialPhotoData();
  }, [fetchInitialPhotoData]);

  // --- Handlers de Eventos e Memoizações ---

  // Memoiza os metadados para SEO, garantindo que só sejam recalculados quando galleryData mudar
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

  // Handler para mostrar as informações adicionais e acionar o carregamento delas
  const handleShowAdditionalInfo = useCallback(() => {
    setShowAdditionalInfo(true); // Define para true para renderizar a seção de detalhes
    // Inicia o carregamento dos dados adicionais SOMENTE se ainda não tiverem sido carregados
    // e se não estiverem em processo de carregamento ou com erro de carregamento anterior
    if (!galleryData?.camera && !loadingAdditionalInfo && !additionalInfoError) {
      fetchAdditionalPhotoData();
    }
  }, [galleryData, loadingAdditionalInfo, additionalInfoError, fetchAdditionalPhotoData]);

  // Handler para quando a imagem principal terminar de carregar
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // --- Estados de Carregamento e Erro na Renderização ---

  // Exibe esqueletos durante o carregamento inicial da foto e informações básicas
  if (loadingInitialData) {
    return (
      <Box sx={{ mt: 10, px: 2, maxWidth: '80%', margin: '0 auto' }}>
        <TypographyTitle src="Informações da Foto" />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2, borderRadius: '8px' }} />
        <Skeleton variant="text" sx={{ mt: 2, fontSize: '2rem' }} /> {/* Para título */}
        <Skeleton variant="text" sx={{ mt: 1, fontSize: '1rem', width: '80%' }} /> {/* Para descrição/autor */}
        <Skeleton variant="rectangular" height={40} width="100%" sx={{ mt: 3, borderRadius: '4px' }} /> {/* Para área do botão */}
      </Box>
    );
  }

  // Exibe mensagem de erro se o carregamento inicial falhar
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
        <IconButton onClick={fetchInitialPhotoData} color="primary" sx={{ mt: 2 }}>
          Tentar Novamente
        </IconButton>
      </Box>
    );
  }

  // --- Renderização do Conteúdo Principal ---
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
            {/* Componente que exibe a foto principal */}
            <PhotoDashboard photoData={galleryData} onImageLoad={handleImageLoad} />
          </Suspense>
        </Box>

        {/* Botão para mostrar informações adicionais, visível somente após a imagem carregar */}
        {imageLoaded && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Tooltip title="Mostrar comentários e detalhes da foto">
              <IconButton
                aria-label="Mostrar informações adicionais"
                onClick={handleShowAdditionalInfo}
                color="primary"
                disabled={loadingAdditionalInfo} // Desabilita enquanto os detalhes adicionais estão carregando
              >
                {loadingAdditionalInfo ? <CircularProgress size={24} /> : <InfoIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Seção de Informações Adicionais (EXIF e Comentários) */}
        {showAdditionalInfo && (
          <>
            {additionalInfoError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {additionalInfoError}
              </Typography>
            )}
            {/* Mostra o progresso enquanto carrega os detalhes adicionais */}
            {loadingAdditionalInfo && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Carregando detalhes adicionais...</Typography>
              </Box>
            )}
            {/* Exibe os detalhes da foto e a caixa de comentários após o carregamento e sem erros */}
            {!loadingAdditionalInfo && !additionalInfoError && (
              <>
                {/* Detalhes técnicos da foto (EXIF) */}
                <Box sx={{ mt: 3 }}>
                  <Typography component="div" variant="h6" gutterBottom>
                    Detalhes da Foto
                  </Typography>
                  <Typography component="div" variant="body2">
                    Câmera: {galleryData?.camera || "Não disponível"} <br />
                    Abertura: {galleryData?.aperture || "Não disponível"} <br />
                    Velocidade: {galleryData?.shutter || "Não disponível"} <br />
                    ISO: {galleryData?.iso || "Não disponível"}
                  </Typography>
                </Box>

                {/* Componente para comentários */}
                <Box sx={{ mt: 3 }}>
                  <Suspense fallback={<Skeleton height={150} />}>
                    <CommentBox itemID={id} />
                  </Suspense>
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      {/* Metatags para SEO, carregadas de forma lazy */}
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