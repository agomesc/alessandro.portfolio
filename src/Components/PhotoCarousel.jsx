import React, { lazy, Suspense } from "react";
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
    <LazyImage
      src={item.original}
      alt={item.title || "Imagem da prévia"}
      width={1200}
      height={720}
    />
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <Suspense fallback={<Skeleton variant="rectangular" />}>
        <ImageGallery
          items={galleryImages}
          showPlayButton={true}
          showFullscreenButton={true}
          renderItem={renderItem}
        />
      </Suspense>
    </div>
  );
};

export default React.memo(PhotoCarousel);