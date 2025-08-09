import React, { useEffect, useState, lazy, useRef, Suspense } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));
const LoadingMessage = lazy(() => import('../Components/LoadingMessage'));

const Gallery = () => {
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const result = flickrInstance.current.getGallerySmall().then(setGalleryData).catch(console.error);
        setGalleryData(result);
      } catch (error) {
        console.error('Erro ao carregar galeria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
      return <LoadingMessage />;
  }

  return (
    <>
      <ContentContainer sx={{ mt: 15, mb: 10 }}>
        <Suspense fallback={<CustomSkeleton variant="text" height="20" />}>
          <TypographyTitle src="Galeria de Fotos" />
        </Suspense>
        <Suspense fallback={<CustomSkeleton height="300" />}>
          <ImageThumbs data={galleryData} />
        </Suspense>
      </ContentContainer>
      <Suspense fallback={null}>
        <SocialMetaTags
          title={galleryData[0]?.title || "Galeria de Fotos"}
          image={galleryData[0]?.img || "/logo_192.png"}
          description={galleryData[0]?.description || "Galeria de Fotos"}
          url={`${window.location.origin}/gallery`}
          type="website" />
      </Suspense>
    </>
  );
};

export default React.memo(Gallery);
