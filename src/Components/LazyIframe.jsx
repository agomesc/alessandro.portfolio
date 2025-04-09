import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

const LoadingMessage = lazy(() => import('./LoadingMessage'));

const loadedIframesCache = new Set(); // Mantém o cache dos iframes já carregados

const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    paddingTop: '56.25%', // 16:9 ratio
    backgroundColor: '#000',
};

const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
};

const LazyIframe = ({ src, title }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasLoaded = useRef(loadedIframesCache.has(src));

    useEffect(() => {
        if (!src) return;

        if (hasLoaded.current) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    loadedIframesCache.add(src);
                    hasLoaded.current = true;
                    if (containerRef.current) observer.unobserve(containerRef.current);
                }
            },
            { rootMargin: '200px' }
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

    return (
        <Suspense fallback={<LoadingMessage />}>
            <div ref={containerRef} style={containerStyle}>
                {isVisible && (
                    <iframe
                        src={src}
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={iframeStyle}
                    />
                )}
            </div>
        </Suspense>
    );
};

LazyIframe.propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
};

LazyIframe.defaultProps = {
    title: 'Vídeo incorporado',
};

export default React.memo(LazyIframe);
