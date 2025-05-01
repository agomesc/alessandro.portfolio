import React, { useRef, useState, useEffect, Suspense } from 'react';
import Skeleton from '@mui/material/Skeleton';

const ImageComponent = ({
  src,
  alt,
  width = '100%',
  height = 'auto'
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
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
      <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
        {isVisible ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{
              margin: 8,
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 8,
              display: 'block',
              padding: 4,
            }}
          />
        ) : (
          <Skeleton variant="rectangular" height={200} />
        )}
      </Suspense>
    </div>
  );
};

export default ImageComponent;
