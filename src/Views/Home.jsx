import React, { useEffect, useState, Suspense, lazy, useMemo } from "react";
import CreateFlickrApp from "../shared/CreateFlickrApp";
import logo from "../images/logo_192.png";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


const SwipeableSlider = lazy(() => import("../Components/SwipeableSlider"));
const TypographyTitle = lazy(() => import("../Components/TypographyTitle"));
const SocialMetaTags = lazy(() => import("../Components/SocialMetaTags"));
const LoadingMessage = lazy(() => import("../Components/LoadingMessage"));
const Gallery = lazy(() => import("./Gallery"));
const GalleryWork = lazy(() => import("./GalleryWork"));


const Home = () => {
    const [galleryData, setGalleryData] = useState(null);
    const instance = useMemo(() => CreateFlickrApp(), []);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const data = await instance.getLatestPhotosThumbnail();
            setGalleryData(data);
        }
        if (!galleryData) fetchData();
    }, [galleryData, instance]);

    if (!galleryData) {
        return <LoadingMessage />;
    }

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };


    const title = 'Atualizações';
    const description = 'Últimas Atualizações';

    return (
        <>

            <Suspense fallback={<LoadingMessage />}>
                <Box
                    sx={{
                        p: 0,
                        width: { xs: "100%", sm: "90%" },
                        alignContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        padding: "0 20px",
                    }}
                >
                    <TypographyTitle src="Atualizações"></TypographyTitle>
                    {galleryData ? <SwipeableSlider itemData={galleryData} /> : <LoadingMessage />}
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        centered
                        sx={{
                            marginTop: 5,
                            marginBottom: -8,
                            '.MuiTabs-indicator': {
                                backgroundColor: '#78884c',
                            },
                        }}
                    >
                        <Tab
                            label="Galeria"
                            sx={{
                                color: tabIndex === 0 ? '#78884c' : '#000',
                                fontWeight: tabIndex === 0 ? 'bold' : 'normal',
                            }}
                        />
                        <Tab
                            label="Meus Trabalhos"
                            sx={{
                                color: tabIndex === 1 ? '#78884c' : '#000',
                                fontWeight: tabIndex === 1 ? 'bold' : 'normal',
                            }}
                        />
                    </Tabs>
                    {tabIndex === 0 && <Gallery />}
                    {tabIndex === 1 && <GalleryWork />}
                </Box>
            </Suspense>
            <SocialMetaTags title={title} image={logo} description={description} />
        </>
    );
};

export default React.memo(Home);
