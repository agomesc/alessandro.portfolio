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
const MessageSnackbar = lazy(() => import("./Components/MessageSnackbar"));
const [showSnackbarOnce, setShowSnackbarOnce] = useState(true); //

const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const instance = useMemo(() => CreateFlickrApp(), []);

    useEffect(() => {
        if (!galleryData) {
            instance.getLatestPhotosThumbnail().then(setGalleryData);
        }

        if (showSnackbarOnce) {
            setSnackbarMessage("Gostou de alguma foto? Deixe um comentário ou uma estrela para apoiar!");
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            setShowSnackbarOnce(false);
        }


    }, [galleryData, instance, showSnackbarOnce]);

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
