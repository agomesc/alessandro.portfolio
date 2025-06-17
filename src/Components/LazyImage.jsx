import React, { useEffect, useState, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';

const LazyImage = ({
  src,
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  srcSet = '', // opcional, melhora qualidade em telas retina
  fallbackColor = '#ccc', // cor do skeleton enquanto carrega
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Detecta se a imagem entrou na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  // Carrega e desenha a imagem no canvas
  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    img.src = src;
    img.loading = 'lazy';
    if (srcSet) img.srcset = srcSet;
    img.crossOrigin = 'anonymous';

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

    img.onerror = () => {
      setLoaded(true); // mostra canvas vazio se erro (pode exibir fallback também)
    };
  }, [shouldLoad, src, srcSet]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        ...style,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: fallbackColor,
            zIndex: 1,
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none',
          objectFit:'cover', // pode ajustar por fora também
          borderRadius: style.borderRadius || 0,
        }}
        aria-label={alt}
      />
    </div>
  );
};

export default React.memo(LazyImage);
