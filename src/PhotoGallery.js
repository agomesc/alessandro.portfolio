import React from 'react';
import PhotoCarousel from './Components/PhotoCarousel';

const PhotoGallery = () => {
  
  const photos = [
    { url: 'https://farm66.staticflickr.com/65535/53110051576_3665908e86_w.jpg?w=162&auto=format&dpr=2' },
    { url: 'https://farm66.staticflickr.com/65535/53000216216_f61daab69c_w.jpg?w=162&auto=format&dpr=2' },
  ];

  return (
    <div>
      <h1>Meu Carrossel de Fotos</h1>
      <PhotoCarousel photos={photos} />
    </div>
  );
};

export default PhotoGallery;

