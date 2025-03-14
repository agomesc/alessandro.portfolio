import React, { useState, useEffect, lazy } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const ImageComponent = lazy(() => import("./ImageComponent"));

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_LINK_PREVIEW}/api/preview?src=${encodeURIComponent(url)}`
                );
                const data = await response.json();

                console.log("data", data);

                if (data) {
                    setPreviewData(data);
                }
            } catch (error) {
                console.error("Erro ao buscar metadados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

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