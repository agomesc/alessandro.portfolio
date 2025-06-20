import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css"; // Estilos padrão da biblioteca
import LazyImage from "../Components/LazyImage"; // Seu componente de imagem lazy

// Importamos o novo arquivo de estilos personalizados
import "./PhotoCarousel.css"; 

const PhotoCarousel = ({ photos }) => {
  // Mapeia as fotos para o formato que a biblioteca `react-image-gallery` espera
  const galleryImages = photos.map((item) => ({
    original: item.url, // URL da imagem em tamanho original
    thumbnail: item.thumbnail || item.url, // URL da miniatura (usa a original se não houver uma específica)
    description: item.title, // Título da imagem para a descrição
  }));

  // Função para renderizar cada item da galeria.
  // Usamos um wrapper para ter mais controle sobre o layout da imagem e da descrição.
  const renderItem = (item) => (
    <div className="image-gallery-image-wrapper">
      <LazyImage
        src={item.original}
        alt={item.description || "Imagem da galeria"}
        className="photo-carousel-main-image" // Classe para estilização no CSS
      />
      {/* Mostra a descrição da imagem se ela existir */}
      {item.description && (
        <span className="image-gallery-description">{item.description}</span>
      )}
    </div>
  );

  return (
    <ImageGallery
      items={galleryImages}
      showPlayButton={true} // Habilita o botão de play/pause
      showFullscreenButton={true} // Habilita o botão de tela cheia
      showNav={true} // Habilita as setas de navegação
      showThumbnails={true} // Habilita as miniaturas na parte inferior
      autoPlay={true} // Inicia o slideshow automaticamente
      slideInterval={4000} // Troca de slide a cada 4 segundos
      slideDuration={600} // Duração da transição entre os slides
      renderItem={renderItem} // Usa nossa função personalizada para renderizar cada imagem
      additionalClass="custom-photo-gallery" // Adiciona uma classe para facilitar a estilização específica
    />
  );
};

export default React.memo(PhotoCarousel);