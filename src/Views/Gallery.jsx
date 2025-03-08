import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));
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
            const data = await instance.getGallery();
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
                        width: "90%",
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                    }}
                >
                    <TypographyTitle src="Portfólio"></TypographyTitle>
                    <ImageMasonry data={galleryData} />
                </Box>
                <CommentBox itemID="Gallery" />
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


