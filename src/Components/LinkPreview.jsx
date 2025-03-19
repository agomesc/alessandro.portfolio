import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    const styles = {
        p: 2,
        width: { xs: "80%", xl: "60%" },
        margin: "0 auto",
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_LINK_PREVIEW}/api/preview?src=${encodeURIComponent(url)}`
                );
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
        return <div>Carregando pré-visualização...</div>;
    }

    if (!previewData) {
        return <div>Pré-visualização não disponível.</div>;
    }

    return (
        <Box sx={{ p: 0, mt: 0, width: "90%", margin: "0 auto", boxShadow: 0, border: 0 }}>
            <Card sx={{ p: 2, width: "70%", margin: "0 auto", boxShadow: 0, border: 0 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 320, height: "auto", objectFit: "cover", padding: 2, borderRadius: 5 }}
                    image={previewData.image}
                    alt={previewData.description}
                    media="photo"
                    loading="lazy"
                    style={styles}
                />
                <CardContent>
                    <Typography component="div" variant="caption" sx={{ textAlign: "center", color: "red" }}>
                        Publicidade
                    </Typography>
                    <Typography component="div" variant="subtitle1" sx={{ textAlign: "center" }}>
                        {previewData.title}
                    </Typography>
                    <Typography component="div" variant="subtitle2" sx={{ textAlign: "center" }}>
                        {previewData.description}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default React.memo(LinkPreview);