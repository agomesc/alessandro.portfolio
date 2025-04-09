import React, { useRef, useState, useEffect } from 'react';

const LazyIframe = ({ src, title }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Começa a carregar um pouco antes de entrar na tela
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                paddingTop: '56.25%', // Aspect ratio 16:9
                backgroundColor: '#000', // opcional: evita tela branca até o iframe carregar
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
    );
};

export default React.memo(LazyIframe);
