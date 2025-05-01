import React, { useRef, useState, useEffect, Suspense } from 'react';
import Skeleton from '@mui/material/Skeleton';

const loadedIframesCache = new Set(); // Mantém o cache dos iframes já carregados

const LazyIframe = ({
    src,
    title = 'Vídeo incorporado',
    ratio = '56.25%' // proporção padrão 16:9
}) => {
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

    const containerStyle = {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: ratio,
        backgroundColor: '#000',
    };

    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
    };

    return (
        <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
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

export default React.memo(LazyIframe);
