import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css'; // Importa o efeito desejado

const ImageComponent = ({ src, alt, maxWidth = 1000 }) => (
  <>
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="black-and-white"
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: 0,
        display: "inline-block",
        maxWidth: maxWidth,
        height: "auto",
        cursor: "pointer",
        zIndex: -1000,
        width: "fit-content",
      }}
      loading="lazy"
    />
  </>
);

export default React.memo(ImageComponent);


