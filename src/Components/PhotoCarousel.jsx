import React, { lazy, Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from '@mui/material/Skeleton';
import LazyImage from "../Components/LazyImage";

const ImageGallery = lazy(() => import("react-image-gallery"));

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  const renderItem = (item) => (
  
      <LazyImage
        src={item.original}
        alt={item.title || "Imagem da prévia"}
        width={1200}
        height={720}
      />

  
  );

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <ImageGallery
        items={galleryImages}
        showPlayButton={false}
        showFullscreenButton={false}
        renderItem={renderItem}
      />
    </Suspense>
  );
};

export default React.memo(PhotoCarousel);
