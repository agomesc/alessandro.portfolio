import React, { useRef, useState, useEffect, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';

const LoadingMessage = lazy(() => import("./LoadingMessage"));

const ImageComponent = ({ src, alt, width, height }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width, height }}>
      <Suspense fallback={<LoadingMessage />}>
        {isVisible && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              display: 'flex',
              padding: "0 auto",
              borderRadius: 8
            }}
          />
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

export default React.memo(ImageComponent);
