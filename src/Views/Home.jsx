import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import logo from "../images/logo_192.png";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const Gallery = lazy(() => import("./Gallery"));
const GalleryWork = lazy(() => import("./GalleryWork"));
const DisplayGalleries = lazy(() => import("./DisplayGalleries"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));

const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const instance = useMemo(() => CreateFlickrApp(), []);

    useEffect(() => {
        if (!galleryData) {
            instance.getLatestPhotosThumbnail().then(setGalleryData);
        }
    }, [galleryData, instance]);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const title = 'Atualizações';
    const description = 'Últimas Atualizações';

    if (!galleryData) {
        return <LoadingMessage />;
    }

    return (
        <Suspense fallback={<LoadingMessage />}>
            <Box
                sx={{
                    p: { xs: 1, sm: 2 },
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <TypographyTitle src="Novas Atualizações" />

                <SwipeableSlider itemData={galleryData} />

                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    variant="fullWidth"
                    sx={{
                        mt: 3,
                        mb: 2,
                        '.MuiTabs-indicator': {
                            backgroundColor: '#78884c',
                        },
                    }}
                >
                    <Tab
                        label="Galeria"
                        sx={{
                            color: tabIndex === 0 ? '#78884c' : '#c0810d',
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                        }}
                    />
                    <Tab
                        label="Meus Trabalhos"
                        sx={{
                            color: tabIndex === 1 ? '#78884c' : '#c0810d',
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                        }}
                    />
                </Tabs>

                {tabIndex === 0 && <Gallery />}
                {tabIndex === 1 && <GalleryWork />}

                <DisplayGalleries />
            </Box>

            <SocialMetaTags title={title} image={logo} description={description} />
        </Suspense>
    );
};

export default React.memo(Home);
