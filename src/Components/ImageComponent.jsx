import React from 'react';

const ImageComponent = ({ src, alt, width = "100%", height = "auto" }) => (
  <img
    alt={alt}
    src={src}
    loading="lazy"
    style={{
      width: { width },
      height: { height },
      objectFit: "cover",
      display: "block"
    }}
  />
);

export default React.memo(ImageComponent);
