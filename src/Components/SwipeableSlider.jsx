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
            {...handlers}
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
                    style={{ width: 200, height: 200, objectFit: "cover", margin: "0 auto", padding: 2, borderRadius: 5 }}
                />
            ))}
        </Box>
    );
};

export default React.memo(SwipeableSlider);