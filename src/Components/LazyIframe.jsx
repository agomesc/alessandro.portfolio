import React, { useRef,useEffect, Suspense } from 'react';
import LoadingMessage from '../Components/LoadingMessage'

const loadedIframesCache = new Set(); 

const LazyIframe = ({
    src,
    title = 'Vídeo incorporado',
    ratio = '56.25%' 
}) => {
    const containerRef = useRef(null);
    const hasLoaded = useRef(loadedIframesCache.has(src));

    useEffect(() => {
        if (!src) return;

        if (hasLoaded.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
        opacity: 1,
        transition: 'opacity 0.5s ease-in-out'
    };

    return (
        <Suspense fallback={<LoadingMessage />}>
            <div ref={containerRef} style={containerStyle}>
                    <iframe
                        src={src}
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={iframeStyle}
                    />
            </div>
        </Suspense>
    );
};

export default React.memo(LazyIframe);
