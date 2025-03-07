import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Box from "@mui/material/Box";

const SwipeableSlider = ({ itemData }) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => console.log('Swiped Left'),
        onSwipedRight: () => console.log('Swiped Right'),
    });

    return (
        <Box


            style={{
                display: 'flex',
                alignItems: 'center',
                overflowX: 'auto', // Permite rolagem horizontal
                position: 'relative',
                width: '100%',
                maxWidth: '100%', // Ajuste para o tamanho desejado
                height: '250px', // Ajuste para o tamanho desejado
            }}
        >
            {itemData.map((image, index) => (
                <img
                    key={index}
                    src={image.url}
                    alt={image.title}
                    style={{
                        marginRight: '10px',
                        width: '100%',
                        maxWidth: '200px', // Ajuste o tamanho das imagens
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            ))}
        </Box>
    );
};

export default SwipeableSlider;