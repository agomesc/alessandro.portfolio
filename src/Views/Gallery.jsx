import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));

const Gallery = () => {
    const [galleryData, setGalleryData] = useState(null);
    const instance = useMemo(() => CreateFlickrApp(), []);

    const metaData = useMemo(() => {
        if (galleryData && galleryData.length > 0) {
            const randomIndex = Math.floor(Math.random() * galleryData.length);
            const randomItem = galleryData[randomIndex];
            return {
                title: randomItem.title,
                description: randomItem.description,
                img: randomItem.img
            };
        };
    }, [galleryData]);

    useEffect(() => {
        async function fetchData() {
            const data = await instance.getGallerySmall();
            setGalleryData(data);
        }

        if (!galleryData) fetchData();
    }, [galleryData, instance]);

    if (!galleryData) {
        return <LoadingMessage />;
    }

    return (
        <>
            <Suspense fallback={<LoadingMessage />}>
                <Box
                    sx={{
                        p: 0,
                        width: "auto",
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        padding: "0 10px",
                    }}
                >
                    <Suspense fallback={<Typography component="div" variant="h4">Carregando...</Typography>}>
                        <TypographyTitle src="Galeria de Fotos" />
                    </Suspense>
                    {galleryData && <ImageMasonry data={galleryData} />}
                    <CommentBox itemID="Gallery" />
                </Box>
            </Suspense>
            <SocialMetaTags
                title={metaData.title}
                image={metaData.img}
                description={metaData.description}
            />
        </>
    );
};

export default React.memo(Gallery);


