import React, { useEffect, useState, lazy, useMemo, useRef, Suspense } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";

const ImageThumbs = lazy(() => import("../Components/ImageThumbs"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const CustomSkeleton = lazy(() => import("../Components/CustomSkeleton"));
const ContentContainer = lazy(() => import('../Components/ContentContainer'));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));

const GalleryWork = () => {
    const [galleryData, setGalleryData] = useState(null);
    const flickrInstance = useRef(null);
    const [loading, setLoading] = useState(true);

    if (!flickrInstance.current) {
        flickrInstance.current = CreateFlickrApp();
    }

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const result = await flickrInstance.current.getGalleryWork();
                setGalleryData(result);
            } catch (error) {
                console.error('Erro ao carregar galeria:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
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
            image: randomItem.img,
            url: `${window.location.origin}/galleryWork`,
        };
    }, [galleryData]);

    
    if (loading) {
        return <LoadingMessage />
    }
    return (
        <>
            <ContentContainer sx={{ mt: 20 }}>
                <Suspense fallback={<CustomSkeleton variant="text" width="100" height="20" />}>
                    <TypographyTitle src="Meus Trabalhos" />
                </Suspense>
                <Suspense fallback={<CustomSkeleton width="600" height="300" />}>
                    <ImageThumbs data={galleryData} />
                </Suspense>
            </ContentContainer>
            <Suspense fallback={null}>
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