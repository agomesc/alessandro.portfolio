import React, { Suspense } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from "@mui/material/Skeleton";
import LazyImage from "../Components/LazyImage";
import ImageGallery from "react-image-gallery";

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
  }));

  const renderItem = (item) => (
    <div className="carousel-container">
      <LazyImage
        src={item.original}
        alt={item.title || "Imagem da galeria"}
        className="carousel-image"
      />
    </div>
  );

  return (
    <div className="carousel-wrapper">
      <Suspense fallback={<Skeleton variant="rectangular" width="100%" height={200} />}>
        <ImageGallery
          items={galleryImages}
          showPlayButton={false}
          showFullscreenButton={true}
          renderItem={renderItem}
          slideDuration={700}
          slideInterval={5000}
          showThumbnails={true}
          autoPlay={true}
          additionalClass="gallery-styled"
        />
      </Suspense>
      <style>
        {`
          .carousel-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            background-color: #f5f5f5;
          }

          .carousel-container {
            width: 100%;
            max-width: 1200px;
            height: 675px;
            overflow: hidden;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
          }

          .carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.5s ease-in-out;
          }

          .gallery-styled .image-gallery-slide {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(PhotoCarousel);