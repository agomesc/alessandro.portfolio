import React, { useState, lazy } from 'react';
import { Box, TextField, Typography } from '@mui/material';

const LinkPreview = lazy(() => import("../Components/LinkPreview"));

const TestWrapper = () => {
    const [url, setUrl] = useState('');

    const handleChange = (e) => {
        setUrl(e.target.value);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '100vh',
                maxWidth: 500,
                margin: '0 auto',
                padding: 2,
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                LinkPreview
            </Typography>
            <TextField
                label="Digite o link aqui"
                variant="outlined"
                fullWidth
                value={url}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
            />
            {url && <LinkPreview url={url} />}
        </Box>
    );
};

export default TestWrapper;