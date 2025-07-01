import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomSkeleton from "../Components/CustomSkeleton"; // Novo componente
import CreateFlickrApp from "../shared/CreateFlickrApp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Importe o ícone
import IconButton from "@mui/material/IconButton"; // Importe o botão de ícone

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const PhotoGallery = lazy(() => import("../Components/PhotoGallery"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Photos = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState(null);
  const [galleryInfoData, setGalleryInfoData] = useState("");
  const [showAlbumInfo, setShowAlbumInfo] = useState(false); // Novo estado
  const instance = useMemo(() => CreateFlickrApp(), []);

  const metaData = useMemo(() => {
    if (galleryData?.length > 0) {
      const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
      return {
        title: randomItem.title || "Galeria de Fotos",
        image: randomItem.url || "",
        description: randomItem.title || "Veja as fotos dessa galeria.",
      };
    }
    return {
      title: "Galeria de Fotos",
      image: "",
      description: "Veja as fotos dessa galeria.",
    };
  }, [galleryData]);

  // Fetches photo data initially
  const fetchData = useCallback(async () => {
    try {
      const data = await instance.getPhotos(id);
      setGalleryData(data);
    } catch (error) {
      console.error("Erro ao carregar a galeria de fotos:", error);
    }
  }, [id, instance]);

  // Fetches album info only when `showAlbumInfo` is true
  const loadAlbumInfo = useCallback(async () => {
    if (showAlbumInfo && !galleryInfoData) { // Only fetch if not already fetched
      try {
        const albumInfo = await instance.getAlbum(id);
        setGalleryInfoData(albumInfo?.description?._content || "");
      } catch (error) {
        console.error("Erro ao carregar informações do álbum:", error);
      }
    }
  }, [id, instance, showAlbumInfo, galleryInfoData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (showAlbumInfo) {
      loadAlbumInfo();
    }
  }, [showAlbumInfo, loadAlbumInfo]); // Only run when showAlbumInfo changes or loadAlbumInfo itself changes

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
            xl: "80%",
          },
          margin: "0 auto",
          padding: "0 20px",
          mt: 10,
        }}
      >
        <Suspense fallback={<CustomSkeleton height={80} />}>
          <TypographyTitle src="Minhas Fotos" />
        </Suspense>

        {/* Info Icon to trigger album info loading */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 3 }}>
          <Typography component="div" variant="subtitle1" sx={{ mr: 1 }}>
            Detalhes da Galeria:
          </Typography>
          <IconButton onClick={() => setShowAlbumInfo(true)} aria-label="mostrar informações da galeria">
            <InfoOutlinedIcon />
          </IconButton>
        </Box>

        {/* Conditionally render album info */}
        {showAlbumInfo && (
          <Suspense fallback={<CustomSkeleton height={80} />}>
            <Typography component="div" sx={{ mt: 1, mb: 3 }} variant="subtitle1">
              {galleryInfoData || <CustomSkeleton height={20} width="80%" />} {/* Show skeleton while loading info */}
            </Typography>
          </Suspense>
        )}

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