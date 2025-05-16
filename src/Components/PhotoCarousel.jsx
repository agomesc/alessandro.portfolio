import React, { lazy, Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from '@mui/material/Skeleton';

const ImageGallery = lazy(() => import("react-image-gallery"));

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
      <img
        loading="lazy"
        src={item.original}
        alt={item.title}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain', 
        }}
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
