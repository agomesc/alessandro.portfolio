import React, { useEffect, useState, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';

const App = ({
  src,
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [src]);

  useEffect(() => {
    if (shouldLoad) {
      const img = new Image();
      img.src = src;
      img.crossOrigin = 'anonymous'; // evita erro de CORS se você quiser toDataURL depois

      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          setLoaded(true);
        }
      };
    }
  }, [shouldLoad, src]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        ...style
      }}
      onContextMenu={(e) => e.preventDefault()} // bloqueia botão direito
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none'
        }}
        aria-label={alt}
      />
    </div>
  );
};

export default React.memo(App);
