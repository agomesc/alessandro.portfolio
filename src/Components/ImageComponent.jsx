import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

const LoadingMessage = lazy(() => import('./LoadingMessage'));

const ImageComponent = ({ src, alt, width, height }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true); // fallback para navegadores que não suportam
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      <Suspense fallback={<div style={{ padding: 16 }}><LoadingMessage /></div>}>
        {isVisible ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: 8,
              display: 'block',
              padding: 4,
            }}
          />
        ) : (
          <LoadingMessage />
        )}
      </Suspense>
    </div>
  );
};

ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ImageComponent.defaultProps = {
  width: '100%',
  height: 'auto',
};

export default ImageComponent;
