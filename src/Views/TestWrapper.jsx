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
            sx={(theme) => ({
                p: 0,
                width: {
                    xs: "100%",
                    sm: "90%",
                    md: "80%",
                    lg: "70%",
                    xl: "80%",
                },
                alignContent: "center",
                alignItems: "center",
                margin: "0 auto",
                padding: theme.customSpacing.pagePadding,
                mt: theme.customSpacing.sectionMarginTop,
            })}
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
