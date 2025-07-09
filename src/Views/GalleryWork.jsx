import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import Box from "@mui/material/Box";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import CustomSkeleton from "../Components/CustomSkeleton"; // Novo componente

const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
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

    return (
        <>
            <Box
                sx={{
                    p: 0,
                    width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "80%" },
                    margin: "0 auto",
                    padding: "0 20px",
                    mt: 10
                }}
            >
                <Suspense fallback={<CustomSkeleton height={100} />}>
                    <TypographyTitle src="Meus Trabalhos" />
                </Suspense>

                <Suspense fallback={<CustomSkeleton height={400} />}>
                    {galleryData ? (
                        <ImageThumbs data={galleryData} />
                    ) : (
                        <CustomSkeleton height={400} />
                    )}
                </Suspense>
            </Box>

            <Suspense fallback={<CustomSkeleton height={150} />}>
                <CommentBox itemID="GalleryWork" />
            </Suspense>

            {metaData && (
                <Suspense fallback={null}>
                    <SocialMetaTags
                        title={metaData.title}
                        image={metaData.url}
                        description={metaData.description}
                    />
                </Suspense>
            )}
        </>
    );
};

export default React.memo(GalleryWork);
