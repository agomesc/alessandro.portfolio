import React from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import LazyImage from "../Components/LazyImage";
import ImageGallery from "react-image-gallery";

const PhotoCarousel = ({ photos }) => {
  const galleryImages = photos.map((item) => ({
    original: item.url,
    thumbnail: item.thumbnail,
    description: item.title,
  }));

  const renderItem = (item) => (
    <LazyImage
      src={item.original}
      alt={item.description || "Imagem da galeria"}
      className="full-screen-image-fit" // Mantemos a classe
    />
  );

  return (
    <>
      <ImageGallery
        items={galleryImages}
        showPlayButton={true}
        showFullscreenButton={true}
        renderItem={renderItem}
        slideDuration={700}
        slideInterval={5000}
        showThumbnails={true}
        autoPlay={true}
        additionalClass="force-fullscreen-fit" // Mantemos a classe para direcionamento
      />

      {/* Bloco de estilos CSS ajustado */}
      <style>
        {`
          /* Estilos para o contêiner principal da galeria em fullscreen */
          .image-gallery-content.fullscreen {
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
          }

          /* Estilos para cada slide da galeria, especialmente em fullscreen */
          .force-fullscreen-fit .image-gallery-slide {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background-color: #000 !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* Estilos para a imagem real (LazyImage) */
          .force-fullscreen-fit .image-gallery-slide .full-screen-image-fit {
            /* Removemos o max-width e max-height para dar mais liberdade */
            /* para a imagem preencher o espaço, confiando no object-fit */
            width: 100% !important;        /* Ocupa 100% da largura disponível no slide */
            height: 100% !important;       /* Ocupa 100% da altura disponível no slide */
            object-fit: contain !important; /* ESSENCIAL: Reduz a imagem para CABER INTEIRA, mantendo a proporção */
            display: block !important;
            transition: opacity 0.5s ease-in-out;
          }

          /* Removendo possíveis margens ou paddings internos da biblioteca */
          .image-gallery-image {
            line-height: 0 !important;
          }
        `}
      </style>
    </>
  );
};

export default React.memo(PhotoCarousel);