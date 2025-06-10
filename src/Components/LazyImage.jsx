import React, { useEffect, useState, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';

const App = ({
  src,
  alt = 'Imagem',
  className = '',
  style = {}
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);

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
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          setAspectRatio(img.height / img.width);
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
        width: '100%',
        paddingBottom: aspectRatio ? `${aspectRatio * 100}%` : '56.25%', // fallback 16:9
        ...style
      }}
      onContextMenu={(e) => e.preventDefault()}
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
          position: 'absolute',
          top: 0,
          left: 0,
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
