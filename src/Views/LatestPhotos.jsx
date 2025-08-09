import { useEffect, useState, Suspense, lazy, useMemo, useRef } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const PhotoGrid = lazy(() => import("../Components/PhotoGrid"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));
const LoadingMessage = lazy(() => import('../Components/LoadingMessage'));

const LatestPhotos = () => {
  const [galleryData, setGalleryData] = useState(null);
  const flickrInstance = useRef(null);

  if (!flickrInstance.current) {
    flickrInstance.current = CreateFlickrApp();
  }

  useEffect(() => {
    if (!galleryData) {
      flickrInstance.current.getLatestPhotos().then(setGalleryData);
    }
  }, [galleryData]);

  const metaData = useMemo(() => {
    if (galleryData?.length > 0) {
      const randomIndex = Math.floor(Math.random() * galleryData.length);
      const randomItem = galleryData[randomIndex];
      return {
        title: randomItem.title || "Atualizações",
        description: randomItem.description || "Últimas atualizações da galeria.",
        image: randomItem.img || "/logo_192.png",
      };
    }
    return {
      title: "Atualizações",
      description: "Últimas atualizações da galeria.",
      image: "/logo_192.png",
    };
  }, [galleryData]);

  if (!galleryData) return <LoadingMessage />;

  return (
    <>
      <ContentContainer sx={{ mt: 15, mb: 10 }}>
        <Suspense fallback={<CustomSkeleton variant="texte" width={100} height={10} />}>
          <TypographyTitle src="Atualizações" />
        </Suspense>
        <Suspense fallback={<CustomSkeleton width={800} height={600} />}>
          <PhotoGrid itemData={galleryData} />
        </Suspense>
        <Suspense fallback={<CustomSkeleton />}>
          <CommentBox itemID="LatestPhotos" />
        </Suspense>
      </ContentContainer>
      <Suspense fallback={null}>
        <SocialMetaTags
          title={metaData.title}
          image={metaData.image}
          description={metaData.description}
          url={`${window.location.origin}/latestPhotos`}
          type="website"
        />
      </Suspense>
    </>
  );
};

export default LatestPhotos;
