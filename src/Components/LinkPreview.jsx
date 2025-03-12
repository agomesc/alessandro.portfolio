import React, { useState, useEffect, lazy } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const ImageComponent = lazy(() => import("./ImageComponent"));
const API_KEY_OPENGRAPH = process.env.REACT_APP_API_KEY_OPENGRAPH;

const getCachedData = (url) => {
    const cached = localStorage.getItem(`opengraph_${url}`);
    return cached ? JSON.parse(cached) : null;
};

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(getCachedData(url));
    const [loading, setLoading] = useState(!previewData);

    useEffect(() => {
        if (previewData) return; // Se já temos cache, evitamos a requisição

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${API_KEY_OPENGRAPH}`
                );
                const data = await response.json();

                if (data.hybridGraph) {
                    setPreviewData(data.hybridGraph);
                    localStorage.setItem(`opengraph_${url}`, JSON.stringify(data.hybridGraph));
                }
            } catch (error) {
                console.error("Erro ao buscar metadados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, previewData]);

    if (loading) {
        return <div>Carregando pré-visualização...</div>;
    }

    if (!previewData) {
        return <div>Pré-visualização não disponível.</div>;
    }

    return (
        <Box sx={{ p: 0, mt: 0, width: "90%", margin: "0 auto", boxShadow: 0 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    width: "50%",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: 0
                }}
            >
                <ImageComponent src={previewData.image} alt={previewData.description} maxWidth={300} />
                <Typography variant="subtitle1" sx={{ textAlign: "center", color: "red" }}>
                    Publicidade
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    {previewData.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                    {previewData.description}
                </Typography>
            </Paper>
        </Box>
    );
};

export default React.memo(LinkPreview);
