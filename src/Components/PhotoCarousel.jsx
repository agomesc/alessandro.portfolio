import React, { lazy } from "react";
import "react-image-gallery/styles/css/image-gallery.css";

const ImageGallery = lazy(() => import("react-image-gallery"));

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  return <ImageGallery items={galleryImages} />;
};
export default React.memo(PhotoCarousel);
