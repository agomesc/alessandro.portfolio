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
  <div
    style={{
      width: "100%",
      maxWidth: "1200px",
      height: "675px", // 1200px de largura com proporção 16:9 = 675px de altura
      overflow: "hidden",
      backgroundColor: "#000", // opcional
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <LazyImage
      src={item.original}
      alt={item.title || "Imagem da prévia"}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>
);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Suspense
        fallback={<Skeleton variant="rectangular" width="100%" height={200} />}
      >
        <ImageGallery
          items={galleryImages}
          showPlayButton={true}
          showFullscreenButton={true}
          renderItem={renderItem}
          additionalClass="responsive-gallery-16x9"
        />
      </Suspense>
      {/* Se quiser manter algum CSS extra, pode usar uma classe separada */}
      <style>
        {`
          /* Garante que o container do slide não seja reajustado */
          .responsive-gallery-16x9 .image-gallery-slide {
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
