import React from 'react';

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
  const wrapperStyle = {
    width,
    height,
    backgroundColor: fallbackColor,
    overflow: 'hidden',
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  return (
    <div
      style={wrapperStyle}
      onContextMenu={(e) => e.preventDefault()} // bloqueia botão direito
    >
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
