import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TypographyTitle = ({ src }) => {
    return (
        <Box>
            <Typography sx={{ mt: 10, mb: 2, fontWeight: 'bold', fontSize: '20px', flexGrow: 1 }} variant="h1" component="h1" gutterBottom>
                {src}
            </Typography>
        </Box>
    );
};

export default React.memo(TypographyTitle);
