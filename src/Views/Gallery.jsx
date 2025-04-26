import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const ViewComponent = lazy(() => import("../Components/ViewComponent"));

const Gallery = () => {
    const [galleryData, setGalleryData] = useState(null);
    const instance = useMemo(() => CreateFlickrApp(), []);

    const metaData = useMemo(() => {
        if (galleryData?.length) {
            const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
            return {
                title: randomItem.title,
                description: randomItem.description,
                img: randomItem.img,
            };
        }
        return null;
    }, [galleryData]);

    useEffect(() => {
        if (!galleryData) {
            instance.getGallerySmall().then(setGalleryData);
        }
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
                        <TypographyTitle src="Galeria de Fotos" />
                        <ViewComponent id="Gallery"/>
                    </Suspense>

                    <ImageMasonry data={galleryData} />

                    <CommentBox itemID="Gallery" />
                </Box>
            </Suspense>

            {metaData && (
                <SocialMetaTags
                    title={metaData.title}
                    image={metaData.img}
                    description={metaData.description}
                />
            )}
        </>
    );
};

export default React.memo(Gallery);
