import React, { useState, useEffect, lazy, Suspense } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const LoadingMessage = lazy(() => import("./LoadingMessage"));

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    const cardMediaStyles = {
        with: "100%",
        height: "auto",
        maxWidth: 300,
        margin: "0 auto",
        objectFit: "fill"
    };


    useEffect(() => {
        const fetchData = async () => {
            const timeout = (ms) =>
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Tempo limite excedido")), ms)
                );

            try {
                const response = await Promise.race([
                    fetch(
                        `${process.env.REACT_APP_LINK_PREVIEW}/api/preview?src=${encodeURIComponent(url)}`
                    ),
                    timeout(10000)
                ]);

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }

                const data = await response.json();

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
        return <LoadingMessage />;
    }

    if (!previewData) {
        return <div>Pré-visualização não disponível.</div>;
    }

    return (
        <Suspense fallback={<LoadingMessage />}>
            <Box sx={{ p: 0, mt: 0, width: "90%", margin: "0 auto", boxShadow: 0, border: 0 }}>
                <Card sx={{ p: 2, margin: "0 auto", boxShadow: 0, border: 0 }}>
                    <CardMedia
                        component="img"
                        image={previewData.image}
                        alt={previewData.description}
                        media="photo"
                        loading="lazy"
                        style={cardMediaStyles}
                    />
                    <CardContent>
                        <Typography component="div" variant="caption" sx={{ textAlign: "center", color: "red" }}>
                            Publicidade / Indicação
                        </Typography>
                        <Typography component="div" variant="body1" sx={{ textAlign: "center", fontWeight: "bold" }}>
                            {previewData.title}
                        </Typography>
                        <Typography component="div" variant="body2" sx={{ textAlign: "center" }}>
                            {previewData.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Suspense>
    );
};

export default React.memo(LinkPreview);