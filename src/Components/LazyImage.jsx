import React, { useState, useEffect, lazy } from 'react';

const CustomSkeleton = lazy(() => import("./CustomSkeleton"));

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

  const wrapperStyle = {
    width,
    height,
    backgroundColor: fallbackColor,
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  // Garante que scrollTo(0) seja aplicado ao montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      style={wrapperStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!loaded && (
        <React.Suspense fallback={null}>
          <CustomSkeleton />
        </React.Suspense>
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
      />
    </div>
  );
};

export default React.memo(App);