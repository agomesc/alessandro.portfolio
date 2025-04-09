import React, { lazy, Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";

const ImageGallery = lazy(() => import("react-image-gallery"));
const LoadingMessage = lazy(() => import('./LoadingMessage'));

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  return (
    <Suspense fallback={<LoadingMessage />}>
      <ImageGallery items={galleryImages} />
    </Suspense>
  );
};

export default React.memo(PhotoCarousel);
