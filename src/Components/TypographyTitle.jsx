import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TypographyTitle = ({ src }) => {
    return (
        <Box>
            <Typography sx={{ mt: 10, mb: 2, fontWeight: 'bold', fontSize: '20px' }} variant="subtitle1">
                {src}
            </Typography>
            <Box sx={{ width: '100%', height: 3, backgroundColor: '#c0810d', mt: 1, mb: 5 }} />
        </Box>
    );
};

export default React.memo(TypographyTitle);
