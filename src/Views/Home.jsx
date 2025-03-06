import React, { useEffect, useState, Suspense, lazy } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import LoadingMessage from "../Components/LoadingMessage";
import logo from "../images/logo_192.png";
import SocialMetaTags from "../Components/SocialMetaTags";
import { Box } from "@mui/material";

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const instance = CreateFlickrApp();

    useEffect(() => {
        async function fetchData() {
            const data = await instance.getLatestPhotos();
            setGalleryData(data);
        }
        if (!galleryData) fetchData();
    }, [galleryData, instance]);

    if (!galleryData) {
        return <LoadingMessage />;
    }

    const title = 'Atualizações';
    const description = 'Últimas Atualizações';

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
                    <TypographyTitle src="Atualizações"></TypographyTitle>
                    {galleryData ? <SwipeableSlider itemData={galleryData} /> : <LoadingMessage />}
                </Box>
            </Suspense>
            <SocialMetaTags title={title} image={logo} description={description} />
        </>
    );
};

export default React.memo(Home);
