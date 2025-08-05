import React, { useEffect, useState, lazy, useMemo, useRef, Suspense } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));

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
            <ContentContainer sx={{ mt: 4 }}>
                <Suspense fallback={<CustomSkeleton />}>
                    <TypographyTitle src="Meus Trabalhos" />
                </Suspense>
                <Suspense fallback={<CustomSkeleton />}>
                    <ImageThumbs data={galleryData} />
                </Suspense>
            </ContentContainer>
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