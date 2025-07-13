import React, { useState } from 'react';
import CustomSkeleton from './CustomSkeleton'; // Certifique-se de que não está usando lazy aqui

const App = ({
  src,
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  srcSet = '',
  fallbackColor = '#ccc',
  aspectRatio = '',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const wrapperStyle = {
    width,
    height,
    backgroundColor: fallbackColor,
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  return (
    <div
      style={wrapperStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!loaded && !error && <CustomSkeleton />}

      {error && (
        <div style={{ color: '#f00', padding: '1rem' }}>
          Falha ao carregar a imagem.
        </div>
      )}

      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        loading="lazy"
        draggable="false"
        className={className}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none',
          pointerEvents: 'none',
          borderRadius: style.borderRadius || 0,
          ...style,
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

export default React.memo(App);