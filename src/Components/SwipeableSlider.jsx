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
            {...handlers} // Ensure swipeable functionality
            style={{
                display: 'flex',
                overflowX: 'auto',
                position: 'relative',
                width: '100%',
                height: 'auto',
                mx: "auto",
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
            }}
        >
            {itemData.map((image, index) => (
                <img
                    key={index}
                    src={image.url}
                    alt={image.title}
                    style={{
                        marginRight: '5px',
                        width: '250px', // Fixed square size
                        height: '250px', // Fixed square size
                        objectFit: 'contain', // Ensures content fits within square
                        borderRadius: '5px', // Optional for rounded squares
                        margin: "0 auto",
                    }}
                />
            ))}
        </Box>
    );
};

export default React.memo(SwipeableSlider);