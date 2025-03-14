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
                maxWidth: { xs: "100%", sm: "90%" },
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
                        marginRight: '10px',
                        width: '100px', // Fixed square size
                        height: 'auto', // Fixed square size
                        objectFit: 'cover', // Ensures content fits within square
                        borderRadius: '8px', // Optional for rounded squares
                    }}
                />
            ))}
        </Box>
    );
};

export default React.memo(SwipeableSlider);