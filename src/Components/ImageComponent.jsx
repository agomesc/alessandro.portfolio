import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css'; // Escolha o efeito desejado

const ImageComponent = ({ src, alt, maxWidth }) => (
  <div>
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="opacity"
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        display: "flex",
        maxWidth: maxWidth,
        width: "100%",
        height: "auto",
        cursor: "pointer",
        flexWrap: 'wrap',
        zIndex: -1000
      }}
      loading="lazy"
    />
  </div>
);

export default ImageComponent;
