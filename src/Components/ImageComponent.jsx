import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';

const LoadingMessage = lazy(() => import("./LoadingMessage"));

const ImageComponent = ({ src, alt, width, height }) => (
  <Suspense fallback={<LoadingMessage />}>
    <img
      alt={alt}
      src={src}
      loading="lazy"
      style={{
        width: width,
        height: height,
        objectFit: 'cover',
        display: 'flex',
      }}
    />
  </Suspense>
);

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