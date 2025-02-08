import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));

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
                url: randomItem.img
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
                        width: "98%",
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography sx={{ mt: 10, mb: 3 }} variant="h4">
                        Portfólio
                    </Typography>
                    <SocialMetaTags
                        title={metaData.title}
                        description={metaData.description}
                        url={metaData.url}
                    />
                    <ImageMasonry data={galleryData} />
                    <CommentBox itemID="Gallery" />
                </Box>
            </Suspense>
        </>
    );
};

export default React.memo(Gallery);


