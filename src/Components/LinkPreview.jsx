import React, { useState, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import Skeleton from '@mui/material/Skeleton';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ImageComponent = lazy(() => import("./ImageComponent"));

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!url) return;

        const timeout = (ms) =>
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Tempo limite excedido")), ms)
            );

        const fetchData = async () => {
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
                } else {
                    setHasError(true);
                }
            } catch (error) {
                console.error("Erro ao buscar preview:", error);
                setHasError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    if (loading) return <Skeleton variant="rectangular" height={100} />;

    if (hasError || !previewData) {
        return (
            <Typography variant="body2"  align="center" color="text.secondary" fallback={<Skeleton variant="rectangular" height={100} />}>
                Não foi possível carregar a pré-visualização.
            </Typography>
        );
    }

    return (
        <Suspense fallback={<Skeleton variant="rectangular" height={100} />}>
            <Box sx={{ p: 0, mt: 0, width: "90%", margin: "0 auto" }}>
                <Card sx={{ p: 2, margin: "0 auto", boxShadow: 0 }}>
                    {previewData.image && (
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                            <ImageComponent
                                src={previewData.image}
                                alt={previewData.description || "Imagem da prévia"}
                                width="150"
                            />
                        </Box>
                    )}
                    <CardContent>
                        <Typography variant="caption" align="center" sx={{ color: "red" }} fallback={<Skeleton variant="rectangular" height={200} />}>
                            Publicidade / Indicação
                        </Typography>
                        <Typography variant="body1" align="center" fontWeight="bold" fallback={<Skeleton variant="rectangular" height={200} />}>
                            {previewData.title}
                            <OpenInNewIcon sx={{ ml: 0.5, fontSize: "small" }} />
                        </Typography>
                        <Typography variant="body2" align="center" fallback={<Skeleton variant="rectangular" height={200} />}>
                            {previewData.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Suspense>
    );
};

LinkPreview.propTypes = {
    url: PropTypes.string.isRequired,
};

export default React.memo(LinkPreview);
