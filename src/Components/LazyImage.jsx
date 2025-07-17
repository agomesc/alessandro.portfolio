import React, { useState, useEffect, useRef } from 'react';

const App = ({
  dataSrc,
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  srcSet = '',
  fallbackColor = 'transparent',
  aspectRatio = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const wrapperStyle = {
    width,
    height: aspectRatio ? 'auto' : height,
    backgroundColor: fallbackColor,
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  const webpSrc = typeof dataSrc === 'object' ? dataSrc.webp : null;
  const fallbackSrc = typeof dataSrc === 'object' ? dataSrc.fallback : dataSrc;

  return (
    <div
      ref={wrapperRef}
      style={wrapperStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      {isVisible && !isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <div
            className="loader"
            style={{
              width: 24,
              height: 24,
              border: '3px solid #ccc',
              borderTop: '3px solid #333',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {isVisible && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={fallbackSrc}
            srcSet={srcSet}
            alt={alt}
            loading="lazy"
            draggable="false"
            fetchpriority="high"
            className={className}
            onLoad={() => setIsLoaded(true)}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: aspectRatio ? '100%' : 'auto',
              display: 'block',
              pointerEvents: 'none',
              borderRadius: style.borderRadius || 0,
              ...style,
            }}
          />
        </picture>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


export default React.memo(App);
