import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const TypographyTitle = ({ src }) => {
    return (
        <Box sx={{ mt: { xs: 10, md: 5, xl: 5 }, mb: 2 }}>
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    textAlign: 'left',
                    display: 'flex', // Adicione "flex" para melhorar a disposição
                    flexDirection: 'column', // Garante que os filhos fiquem em ordem

                }}
                gutterBottom
            >
                {src}
            </Typography>
        </Box>
    );
};

export default React.memo(TypographyTitle);
