import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const GalleryWork = () => {
    const [galleryData, setGalleryData] = useState(null);
    const instance = useMemo(() => CreateFlickrApp(), []);

    useEffect(() => {
        if (!galleryData) {
            instance.getGalleryWork().then(setGalleryData);
        }
    }, [galleryData, instance]);

    const metaData = useMemo(() => {
        if (!galleryData?.length) return null;

        const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
        return {
            title: randomItem.title,
            description: randomItem.description,
            url: randomItem.img,
        };
    }, [galleryData]);

    if (!galleryData) {
        return <LoadingMessage />;
    }

    return (
        <>
            <Suspense fallback={<LoadingMessage />}>
                <Box
                    sx={{
                        p: 0,
                        width: {
                            xs: "100%", // Para telas extra pequenas (mobile)
                            sm: "90%",  // Para telas pequenas
                            md: "80%",  // Para telas médias
                            lg: "70%",  // Para telas grandes
                            xl: "80%"   // Para telas extra grandes
                        },
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        padding: "0 20px",
                        mt: 10
                    }}
                >
                    <Suspense fallback={<Typography component="div" variant="h4">Carregando...</Typography>}>
                        <TypographyTitle src="Meus Trabalhos" />
                    </Suspense>

                    <ImageMasonry data={galleryData} />
                    <CommentBox itemID="GalleryWork" />
                </Box>
            </Suspense>

            {metaData && (
                <SocialMetaTags
                    title={metaData.title}
                    image={metaData.url}
                    description={metaData.description}
                />
            )}
        </>
    );
};

export default React.memo(GalleryWork);
