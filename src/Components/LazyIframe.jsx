import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';

const LoadingMessage = lazy(() => import("./LoadingMessage"));

const loadedIframesCache = new Set(); // Cache persistente na vida do app

const LazyIframe = ({ src, title }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasLoaded = useRef(loadedIframesCache.has(src)); // Evita re-render desnecessário

    useEffect(() => {
        if (hasLoaded.current) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    loadedIframesCache.add(src); // Marca como carregado
                    hasLoaded.current = true;
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [src]);

    return (
        <Suspense fallback={<LoadingMessage />}>
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    paddingTop: '56.25%',
                    backgroundColor: '#000',
                }}
            >
                {isVisible && (
                    <iframe
                        src={src}
                        title={title}
                        loading="lazy"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                        }}
                    />
                )}
            </div>
        </Suspense>
    );
};

export default React.memo(LazyIframe);
