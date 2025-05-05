import React, { lazy, Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import LoadingMessage from './LoadingMessage';

const ImageGallery = lazy(() => import("react-image-gallery"));

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  // Força o mesmo tamanho para todas as imagens
  const renderItem = (item) => (
    <div
      style={{
        width: '100%',
        height: '400px', // você pode ajustar essa altura conforme o layout
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      <img
        src={item.original}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain', // ou "cover" se quiser preencher
        }}
      />
    </div>
  );

  return (
    <Suspense fallback={<LoadingMessage />}>
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
