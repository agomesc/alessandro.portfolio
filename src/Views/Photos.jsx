import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
  useRef
} from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Importe o ícone
import IconButton from "@mui/material/IconButton"; // Importe o botão de ícone

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));


const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const flickrInstance = useRef(null);
  const [galleryInfoData, setGalleryInfoData] = useState("");
  const [showAlbumInfo, setShowAlbumInfo] = useState(false); // Novo estado
   
  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  // Fetches photo data initially
  const fetchData = useCallback(async () => {
    try {
      const data = await flickrInstance.current.getPhotos(id);
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao carregar a galeria de fotos:", error);
    }
  }, [id]);

  const loadAlbumInfo = useCallback(async () => {
    if (showAlbumInfo && !galleryInfoData) { 
      try {
        const albumInfo = await flickrInstance.current.getAlbum(id);
        setGalleryInfoData(albumInfo?.description?._content || "");
      } catch (error) {
        console.error("Erro ao carregar informações do álbum:", error);
      }
    }
  }, [id, showAlbumInfo, galleryInfoData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (showAlbumInfo) {
      loadAlbumInfo();
    }
  }, [showAlbumInfo, loadAlbumInfo]); 

  if (!galleryData) {
    return <CustomSkeleton />;
  }

  return (
      <Suspense fallback={<CustomSkeleton />}>
        <Box
          sx={(theme) => ({
            p: 0,
            width: {
              xs: "100%",
              sm: "90%",
              md: "80%",
              lg: "70%",
              xl: "80%",
            },
            alignContent: "center",
            alignItems: "center",
            margin: "0 auto",
            padding: theme.customSpacing.pagePadding,
            mt: theme.customSpacing.sectionMarginTop,
          })}
        >
          <TypographyTitle src="Minhas Fotos" />
          {/* Info Icon to trigger album info loading */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 3 }}>

            <Typography component="div" variant="subtitle1" sx={{ mr: 1 }}>
              Detalhes da Galeria:
            </Typography>

            <IconButton onClick={() => setShowAlbumInfo(true)} aria-label="mostrar informações da galeria">
              <InfoOutlinedIcon />
            </IconButton>
          </Box>
          {showAlbumInfo && (
            <Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
              {galleryInfoData || <CustomSkeleton />}
            </Typography>

          )}
          <PhotoGallery src={galleryData} />
        </Box>
        <CommentBox itemID={id} />
        <SocialMetaTags
          title={galleryInfoData}
          image="/logo_192.png"
          description={galleryInfoData}
        />

      </Suspense>
  );
};

export default React.memo(Photos);