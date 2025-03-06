import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const SwipeableSlider = ({ itemData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSwipe = ({ dir }) => {
        if (dir === 'Left') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % itemData.length);
        } else if (dir === 'Right') {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + itemData.length) % itemData.length);
        }
    };

    console.log('itemData', itemData);

    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe({ dir: 'Left' }),
        onSwipedRight: () => handleSwipe({ dir: 'Right' }),
    });

    return (
        <div
            {...handlers}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
                maxWidth: '400px', // Ajuste para o tamanho desejado
                height: '250px', // Ajuste para o tamanho desejado
            }}
        >
            {itemData.map((image, index) => (
                <img
                    key={index}
                    src={image.url}
                    alt={image.title}
                    style={{
                        display: currentIndex === index ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            ))}
        </div>
    );
};

export default SwipeableSlider;