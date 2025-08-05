import React, { useState } from 'react';
import './PhotoCarouselWithThumbnails.css';

const PhotoCarouselWithThumbnails = ({ photos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return <p>Nenhuma foto disponível.</p>;
  }

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container">
      <div className="main-photo">
        <img src={photos[currentIndex]} alt={`Foto ${currentIndex + 1}`} />
      </div>
      <div className="thumbnails">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Thumbnail ${index + 1}`}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarouselWithThumbnails;
