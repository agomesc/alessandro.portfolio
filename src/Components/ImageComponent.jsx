import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ImageComponent = ({ src, alt, maxWidth }) => (
  <div>
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        display: "block",
        maxWidth: maxWidth,
        minWidth: '80px',
        width: "100%",
        height: "auto",
        cursor: "pointer",
        flexWrap: 'wrap',
        zIndex: -1000,
      }}
      loading="lazy"
    />
  </div>
);

export default ImageComponent;
