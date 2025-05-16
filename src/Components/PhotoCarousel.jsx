import React, { lazy, Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from '@mui/material/Skeleton';

const ImageGallery = lazy(() => import("react-image-gallery"));
const LazyImage = lazy(() => import("../Components/LazyImage"));

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  const renderItem = (item) => (
    <div
      style={{
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <LazyImage
        src={item.original}
        alt={item.title || "Imagem da prévia"}

      />

    </div>
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
