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
                    p: 0,
                    width: { xs: "100%", sm: "90%", md: "80%", lg: "70%", xl: "60%" },
                    alignContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    padding: "0 10px",
                    paddingTop: { xs: '10px', sm: '60px' }, // espaço para o menu
                }}
            >

                <TypographyTitle src="Novas Atualizações" />

                <SwipeableSlider itemData={galleryData} />

                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        marginTop: 3,
                        marginBottom: -8,
                        '.MuiTabs-indicator': {
                            backgroundColor: '#78884c',
                        },
                    }}
                >
                    <Tab
                        label="Galeria"
                        sx={{
                            color: tabIndex === 0 ? '#78884c' : '#c0810d',
                            fontWeight: tabIndex === 0 ? 'bold' : 'normal',
                            '&.Mui-selected': {
                                color: '#78884c',
                            },
                        }}
                    />
                    <Tab
                        label="Meus Trabalhos"
                        sx={{
                            color: tabIndex === 1 ? '#78884c' : '#c0810d',
                            fontWeight: tabIndex === 1 ? 'bold' : 'normal',
                            '&.Mui-selected': {
                                color: '#78884c',
                            },
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
