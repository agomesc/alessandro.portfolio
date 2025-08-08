import React, {
  useEffect,
  useState,
  lazy,
  useCallback,
  Suspense,
  useRef
} from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Importe o ícone
import IconButton from "@mui/material/IconButton";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));
const LoadingMessage = lazy(() => import('../Components/LoadingMessage'));

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const flickrInstance = useRef(null);
  const [galleryInfoData, setGalleryInfoData] = useState("");
  const [showAlbumInfo, setShowAlbumInfo] = useState(false); // Novo estado

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

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
    return <LoadingMessage />;
  }

  return (
    <>
      <ContentContainer sx={{ mt: 20 }}>
        <Suspense fallback={<CustomSkeleton variant="text" height={10} />}>
          <TypographyTitle src="Minhas Fotos" />
        </Suspense>
        <Suspense fallback={<CustomSkeleton variant="text" height={10} />}>
          <Typography component="div" variant="subtitle1" sx={{ mr: 1 }}>
            Detalhes da Galeria:
          </Typography>
        </Suspense>
        <IconButton onClick={() => setShowAlbumInfo(true)} aria-label="mostrar informações da galeria">
          <InfoOutlinedIcon />
        </IconButton>
        {showAlbumInfo && (
          <Suspense fallback={<CustomSkeleton variant="text" height={10} />}>
            <Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
              {galleryInfoData || <CustomSkeleton />}
            </Typography>
          </Suspense>
        )}
        <Suspense fallback={<CustomSkeleton height={800} />}>
          <PhotoGallery src={galleryData} />
        </Suspense>
        <Suspense fallback={<CustomSkeleton height={600} />}>
          <CommentBox itemID={id} />
        </Suspense>
        <Suspense fallback={null}>
          <SocialMetaTags
            title={galleryInfoData}
            image="/logo_192.png"
            description={galleryInfoData}
            url={`${window.location.origin}/photo/${id}`}
            type="website"
          />
        </Suspense>
      </ContentContainer>
    </>
  );
};

export default React.memo(Photos);