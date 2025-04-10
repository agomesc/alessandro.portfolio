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
            sx={{
                p: 0,
                width: {
                    xs: "100%", // Para telas extra pequenas (mobile)
                    sm: "90%",  // Para telas pequenas
                    md: "80%",  // Para telas médias
                    lg: "70%",  // Para telas grandes
                    xl: "80%"   // Para telas extra grandes
                },
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: "0 20px",
                mt: 10
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
