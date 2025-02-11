import CreateFlickrApp from "../shared/CreateFlickrApp";
import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import LoadingMessage from "../Components/LoadingMessage";
import SocialMetaTags from "../Components/SocialMetaTags";

const ImageMasonry = lazy(() => import("../Components/ImageMasonry"));
const CommentBox = lazy(() => import("../Components/comments"));

const GalleryWork = () => {
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
            const data = await instance.getGalleryWork();
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
                <SocialMetaTags
                    title={metaData.title}
                    image={metaData.url}
                    description={metaData.description}
                />
                <ImageMasonry data={galleryData} />
                <CommentBox itemID="Gallery" />
            </Suspense>
        </>
    );
};

export default React.memo(GalleryWork);
