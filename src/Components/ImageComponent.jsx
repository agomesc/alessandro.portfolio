import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const ImageComponent = ({ src, alt }) => (
  <>
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="opacity"
      style={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        display: "block",
        maxWidth: "100%",
        minWidth: '80px',
        width: "100%",
        height: "auto",
        cursor: "pointer",
        flexWrap: 'wrap',
        zIndex: -1000,
      }}
      loading="lazy"
    />
  </>
);

export default React.memo(ImageComponent);