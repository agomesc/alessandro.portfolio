import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import ImageComponent from "./ImageComponent";

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
                const data = await response.json();
                setPreviewData(data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (!previewData) fetchData();
    }, [url]);

    if (loading) {
        return <div>Carregando pré-visualização...</div>;
    }

    if (!previewData) {
        return <div>Pré-visualização não disponível.</div>;
    }

    return (<>
        <Box sx={{
            p: 10,
            width: "auto",
            alignContent: "center",
            alignItems: "center",
            margin: "0 auto",
            marginBottom: 30,
            maxHeight: 250,
            maxWidth: "80%"
        }}>
            <Paper elevation={3} sx={{
                p: 2,
            }}>
                <ImageComponent src={previewData?.image?.url} alt={previewData?.description} maxWidth="150px" ></ImageComponent>
                <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    {previewData?.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    {previewData?.description}
                </Typography>
            </Paper>
        </Box>
    </>
    );
};

export default React.memo(LinkPreview);
