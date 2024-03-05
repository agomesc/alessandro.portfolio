// src/components/PhotoGallery.js
import React, { useState } from "react";
import "./PhotoGallery.css"; // Estilo opcional

const PhotoGallery = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <div className="photo-gallery">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.title}
          onClick={() => handlePhotoClick(photo)}
        />
      ))}

      {selectedPhoto && (
        <div className="fullscreen-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="image-container">
            <img className="image" src={selectedPhoto.url} alt={selectedPhoto.title} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
