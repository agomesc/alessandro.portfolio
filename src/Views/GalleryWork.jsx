import React, { useEffect, useState, lazy, useMemo, useRef, Suspense } from "react";
import Box from "@mui/material/Box";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const GalleryWork = () => {
    const [galleryData, setGalleryData] = useState(null);
    const flickrInstance = useRef(CreateFlickrApp());

    useEffect(() => {
        flickrInstance.current
            .getGalleryWork()
            .then(setGalleryData)
            .catch(console.error);
    }, []);

    const metaData = useMemo(() => {
        if (!galleryData || galleryData.length === 0) {
            return {
                title: "Meus Trabalhos",
                description: "Galeria de Trabalhos de Fotografia",
                image: "/logo_192.png",
                url: `${window.location.origin}/galleryWork`,
            };
        }
        const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
        return {
            title: randomItem.title,
            description: randomItem.description,
            image: randomItem.img, // 'image' é o nome da prop
            url: `${window.location.origin}/galleryWork`,
        };
    }, [galleryData]);

    if (!galleryData) {
        return <CustomSkeleton />;
    }

    return (
        <>
            <Box
                sx={(theme) => ({
                    p: 0,
                    width: {
                        xs: "100%",
                        sm: "90%",
                        md: "80%",
                        lg: "70%",
                        xl: "80%",
                    },
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    padding: theme.customSpacing.pagePadding,
                    mt: theme.customSpacing.sectionMarginTop,
                })}
            >
                <Suspense fallback={<CustomSkeleton />}>
                    <TypographyTitle src="Meus Trabalhos" />
                </Suspense>
                <Suspense fallback={<CustomSkeleton />}>
                    <ImageThumbs data={galleryData} />
                </Suspense>
            </Box>
            <Suspense fallback={<CustomSkeleton />}>
                <SocialMetaTags
                    title={metaData.title}
                    image={metaData.image}
                    description={metaData.description}
                    url={metaData.url}
                    type="website"
                />
            </Suspense>
        </>
    );
};

export default React.memo(GalleryWork);