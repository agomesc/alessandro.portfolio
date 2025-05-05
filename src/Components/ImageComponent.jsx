import React, { useState } from 'react';
import LoadingMessage from './LoadingMessage'

const ImageComponent = ({
  src,
  alt,
  width = '100%',
  height = 'auto'
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {!loaded && (
        <LoadingMessage/>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          margin: 8,
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: 8,
          display: 'block',
          padding: 4,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

export default React.memo(ImageComponent);
