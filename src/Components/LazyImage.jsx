import React, { useState, useEffect, useRef } from 'react';

const loaderStyle = {
  width: 24,
  height: 24,
  border: '3px solid #ccc',
  borderTop: '3px solid #333',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const LazyImage = ({
  dataSrc,
  alt = '',
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  srcSet = '',
  sizes = '(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px',
  fallbackColor = 'transparent',
  aspectRatio = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const wrapperRef = useRef(null);
  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.current.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (wrapperRef.current) observer.current.observe(wrapperRef.current);

    return () => observer.current?.disconnect();
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
          <div className="loader" style={loaderStyle} />
        </div>
      )}

      {isVisible && (
        <picture role="img">
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={fallbackSrc}
            srcSet={srcSet}
            alt={alt || 'Imagem sem descrição'}
            loading="lazy"
            draggable="false"
            sizes={sizes}
            className={className}
            onLoad={() => setIsLoaded(true)}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: aspectRatio ? '100%' : 'auto',
              display: 'block',
              pointerEvents: 'none',
              ...style,
              borderRadius: style?.borderRadius ?? 0,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
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

export default React.memo(LazyImage);
