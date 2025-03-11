import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css'; // Importa o efeito desejado

const ImageComponent = ({ src, alt }) => (
  <LazyLoadImage
    alt={alt}
    src={src}
    effect="black-and-white"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // Garante que a imagem cubra o contêiner sem distorcer
      display: "block"
    }}
    loading="lazy"
  />
);

export default React.memo(ImageComponent);
