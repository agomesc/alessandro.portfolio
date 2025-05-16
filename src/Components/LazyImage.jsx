import React, { useEffect, useState, useRef, Suspense } from 'react';
import Skeleton from '@mui/material/Skeleton';
const LazyImage = ({ src, alt = 'Imagem', width = '100%', height = 'auto', className = '', style = {} }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <Suspense fallback={<Skeleton variant="rounded" />}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={className}
        style={{
          margin: '0 auto',
          width,
          height,
          objectFit: 'cover',
          display: 'block',
          ...style
        }}
      />
    </Suspense>
  );
};

export default React.memo(LazyImage);