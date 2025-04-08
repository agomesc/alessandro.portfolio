import React, { Suspense } from 'react';

const LazyIframe = ({ src, title }) => {
    return (
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                paddingTop: '56.25%', // Aspect ratio: 16:9
            }}
        >
            <iframe
                src={src}
                title={title}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                }}
            ></iframe>
        </div>
    );
};

export default React.memo(LazyIframe);