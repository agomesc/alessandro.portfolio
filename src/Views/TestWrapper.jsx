import React, { useState, lazy, Suspense } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';

const LinkPreview = lazy(() => import("../Components/LinkPreview"));

const isValidUrl = (url) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
        return false;
    }
};

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
                Teste de LinkPreview
            </Typography>

            <TextField
                label="Digite o link aqui"
                variant="outlined"
                placeholder="https://exemplo.com"
                fullWidth
                value={url}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
            />

            {isValidUrl(url) && (
                <Suspense fallback={<CircularProgress />}>
                    <LinkPreview url={url} />
                </Suspense>
            )}
        </Box>
    );
};

export default TestWrapper;
