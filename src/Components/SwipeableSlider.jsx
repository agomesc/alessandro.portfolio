import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";

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
                width: '80%',
                height: 'auto',
                mx: "auto",
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
            }}
        >
            {itemData.map((image, index) => (
                <NavLink key={index} to={`/latestphotos`} style={{ textDecoration: "none" }}>
                    <img
                        key={index}
                        src={image.url}
                        alt={image.title}
                        style={{ width: 100, height: 75, objectFit: "cover", margin: "0 auto", padding: 2, borderRadius: 5 }}
                    />
                </NavLink>
            ))}

        </Box>
    );
};

export default React.memo(SwipeableSlider);