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
  const wrapperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // carrega uma vez só
        }
      },
      {
        rootMargin: '100px', // pré-carregamento antes da imagem entrar na tela
        threshold: 0.1, // porcentagem visível do elemento para disparar
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const wrapperStyle = {
    width,
    height,
    backgroundColor: fallbackColor,
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  return (
    <div
      ref={wrapperRef}
      style={wrapperStyle}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={isVisible ? dataSrc : undefined}
        srcSet={isVisible ? srcSet : undefined}
        alt={alt}
        loading="lazy"
        draggable="false"
        className={className}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: 'auto',
          display: 'block',
          pointerEvents: 'none',
          borderRadius: style.borderRadius || 0,
          ...style,
        }}
      />
    </div>
  );
};

export default React.memo(App);