import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import LoadingMessage from './LoadingMessage'

const SwipeableSlider = ({ itemData }) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => console.log('Swiped Left'),
        onSwipedRight: () => console.log('Swiped Right'),
    });

    return (
        <Box
            {...handlers}
            sx={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                gap: 1,
                px: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                margin:'auto 0'
            }}
        >
            {itemData.map((image) => (
                <NavLink key={image.id} to={`/latestphotos`} style={{ scrollSnapAlign: 'center', textDecoration: 'none' }}>
                    <img
                        src={image.url}
                        alt={image.title}
                        loading="lazy"
                        style={{
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    />
                </NavLink>
            ))}
        </Box>
    );
};

export default React.memo(SwipeableSlider);
