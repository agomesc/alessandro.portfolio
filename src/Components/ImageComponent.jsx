import React from 'react';

const ImageComponent = ({ src, alt, width, height }) => (
  <img
    alt={alt}
    src={src}
    loading="lazy"
    style={{
      width: width,
      height: height,
      objectFit: "cover",
      display: "flex"
    }}
  />
);

export default React.memo(ImageComponent);
