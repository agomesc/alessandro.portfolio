import React, { useEffect, useState, Suspense, lazy, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const CommentBox = lazy(() => import("../Components/CommentBox"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));

const GalleryWork = () => {
    const [galleryData, setGalleryData] = useState(null);
    const flickrInstance = useRef(null);

    if (!flickrInstance.current) {
        flickrInstance.current = CreateFlickrApp();
    }


    useEffect(() => {
        if (!galleryData) {
            flickrInstance.current.getGalleryWork().then(setGalleryData);
        }
    }, [galleryData]);

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
        <Suspense fallback={<CustomSkeleton />}>
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
                <TypographyTitle src="Meus Trabalhos" />
                {galleryData ? (
                    <ImageThumbs data={galleryData} />
                ) : (
                    <CustomSkeleton height={400} />
                )}
            </Box>
            <CommentBox itemID="GalleryWork" />
            {metaData && (
                <SocialMetaTags
                    title={metaData.title}
                    image={metaData.url}
                    description={metaData.description}
                    url={`${window.location.origin}/galleryWork`}
                    type="website"
                />
            )}
        </Suspense>
    );
};

export default React.memo(GalleryWork);
