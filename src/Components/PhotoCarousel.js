import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"; // Importe os estilos

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  return (
    <div>
      <ImageGallery items={galleryImages} />
    </div>
  );
};
export default PhotoCarousel;
